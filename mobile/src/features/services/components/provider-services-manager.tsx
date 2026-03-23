import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MutedText, UIText } from "@/components/ui/text";
import { listCategories } from "@/features/services/api/list-categories";
import { createProviderService } from "@/features/services/api/create-provider-service";
import { listProviderServicesForCurrentUser } from "@/features/services/api/list-provider-services-for-current-user";
import { updateProviderService } from "@/features/services/api/update-provider-service";
import { ProviderServiceForm } from "@/features/services/components/provider-service-form";
import { formatHourlyRate } from "@/features/services/lib/formatters";
import type {
  ProviderServiceFormValues,
  ProviderServiceListItem
} from "@/features/services/types";
import { View } from "@/tw";

type ProviderServicesManagerProps = {
  providerId: string;
};

export function ProviderServicesManager({
  providerId
}: ProviderServicesManagerProps) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = React.useState(false);
  const [editingService, setEditingService] =
    React.useState<ProviderServiceListItem | null>(null);

  const categoriesQuery = useQuery({
    queryFn: listCategories,
    queryKey: ["service-categories"]
  });
  const servicesQuery = useQuery({
    enabled: Boolean(providerId),
    queryFn: () => listProviderServicesForCurrentUser(providerId),
    queryKey: ["provider-services", providerId]
  });

  const invalidateMarketplace = React.useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["provider-services", providerId] }),
      queryClient.invalidateQueries({ queryKey: ["top-provider-services"] }),
      queryClient.invalidateQueries({ queryKey: ["services-search"] }),
      queryClient.invalidateQueries({ queryKey: ["service-detail"] })
    ]);
  }, [providerId, queryClient]);

  const createMutation = useMutation({
    mutationFn: (values: ProviderServiceFormValues) =>
      createProviderService(providerId, values),
    onSuccess: async () => {
      setIsCreating(false);
      await invalidateMarketplace();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({
      serviceId,
      values
    }: {
      serviceId: number;
      values: ProviderServiceFormValues;
    }) => updateProviderService(serviceId, values),
    onSuccess: async () => {
      setEditingService(null);
      await invalidateMarketplace();
    }
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <View className="gap-4 rounded-[32px] bg-brand-card p-6 shadow-[0_12px_32px_rgba(24,35,40,0.08)]">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <UIText className="text-lg font-semibold">Mes services</UIText>
          <MutedText className="text-sm leading-6">
            Gere les prestations visibles dans la recherche et sur la fiche detail.
          </MutedText>
        </View>
        <Button
          className="min-h-10 px-4"
          onPress={() => {
            setEditingService(null);
            setIsCreating((current) => !current);
          }}
          variant={isCreating ? "ghost" : "primary"}
        >
          {isCreating ? "Fermer" : "Ajouter"}
        </Button>
      </View>

      {servicesQuery.isLoading ? (
        <View className="items-center gap-3 py-6">
          <Spinner />
          <MutedText>Chargement de vos prestations...</MutedText>
        </View>
      ) : servicesQuery.data?.length ? (
        <View className="gap-3">
          {servicesQuery.data.map((service) => (
            <View
              key={service.id}
              className="gap-3 rounded-[24px] border border-brand-border bg-white p-4"
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
                  <UIText className="text-base font-semibold">{service.title}</UIText>
                  <MutedText className="text-sm">{service.category.name}</MutedText>
                  <MutedText className="text-sm" numberOfLines={2}>
                    {service.short_description}
                  </MutedText>
                </View>
                <View
                  className={`rounded-full px-3 py-1.5 ${
                    service.is_active ? "bg-brand-mint" : "bg-brand-sand-strong"
                  }`}
                >
                  <UIText
                    className={`text-xs font-semibold ${
                      service.is_active ? "text-white" : "text-brand-ink"
                    }`}
                  >
                    {service.is_active ? "Active" : "Brouillon"}
                  </UIText>
                </View>
              </View>

              <View className="flex-row items-center justify-between gap-3">
                <MutedText className="text-sm">
                  {formatHourlyRate(service.hourly_rate)}
                </MutedText>
                <Button
                  className="min-h-10 px-4"
                  onPress={() => {
                    setIsCreating(false);
                    setEditingService(service);
                  }}
                  variant="ghost"
                >
                  Modifier
                </Button>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="rounded-[24px] border border-dashed border-brand-border bg-white p-4">
          <MutedText className="text-sm leading-6">
            Aucune prestation enregistree pour le moment. Ajoutez-en une pour la
            rendre visible dans la marketplace.
          </MutedText>
        </View>
      )}

      {(isCreating || editingService) && categoriesQuery.data ? (
        <ProviderServiceForm
          categories={categoriesQuery.data}
          initialService={editingService}
          loading={isSubmitting}
          onCancel={() => {
            setEditingService(null);
            setIsCreating(false);
          }}
          onSubmit={(values) => {
            if (editingService) {
              updateMutation.mutate({
                serviceId: editingService.id,
                values
              });
              return;
            }

            createMutation.mutate(values);
          }}
        />
      ) : null}

      {createMutation.error instanceof Error ? (
        <MutedText className="text-sm text-brand-danger">
          {createMutation.error.message}
        </MutedText>
      ) : null}

      {updateMutation.error instanceof Error ? (
        <MutedText className="text-sm text-brand-danger">
          {updateMutation.error.message}
        </MutedText>
      ) : null}
    </View>
  );
}
