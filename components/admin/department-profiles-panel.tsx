"use client";

import { useMemo, useState } from "react";
import {
  Star,
  Trash2,
  Pencil,
  Check,
  X,
  Plus,
  Layers,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductAutocomplete } from "@/components/ui/product-autocomplete";
import { useToast } from "@/hooks/use-toast";
import type { Department, DepartmentProfile, Product } from "@/lib/api-types";
import {
  useUpdateDepartment,
  useRemoveDepartmentProfile,
  type DepartmentProfileMutationInput,
} from "@/hooks/auth-hooks";

interface DepartmentProfilesPanelProps {
  department: Department;
  products: Product[];
  onDepartmentUpdate?: (department: Department) => void;
  refetchDepartments?: () => Promise<unknown>;
}

function toProfileInputs(profiles: DepartmentProfile[]): DepartmentProfileMutationInput[] {
  return profiles.map((profile) => ({
    // Only send an id for existing profiles — new ones are created by the backend.
    ...(profile.id ? { id: profile.id } : {}),
    name: profile.name,
    isDefault: profile.isDefault,
    productIds: profile.products.map((product) => String(product.id)),
  }));
}

export function DepartmentProfilesPanel({
  department,
  products,
  onDepartmentUpdate,
  refetchDepartments,
}: DepartmentProfilesPanelProps) {
  const { toast } = useToast();
  const { updateDepartment, loading: updating } = useUpdateDepartment();
  const { removeDepartmentProfile, loading: removing } =
    useRemoveDepartmentProfile();

  // Add-profile form state
  const [addingProfile, setAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("Default");
  const [newProfileProductIds, setNewProfileProductIds] = useState<string[]>([]);
  const [newProfileProducts, setNewProfileProducts] = useState<Record<string, Product>>({});
  const [pendingProductId, setPendingProductId] = useState("");
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  // Per-profile editing state
  const [renamingProfileId, setRenamingProfileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [addingToProfileId, setAddingToProfileId] = useState<string | null>(null);
  const [pendingProfileProductId, setPendingProfileProductId] = useState("");
  const [pendingProfileProduct, setPendingProfileProduct] = useState<Product | null>(null);
  const [busyProfileId, setBusyProfileId] = useState<string | null>(null);

  const profiles = department.profiles || [];
  const defaultProfile = profiles.find((profile) => profile.isDefault);

  const availableForProfile = useMemo(() => {
    const linked = new Set((department.profiles || []).flatMap((p) => p.products.map((pr) => String(pr.id))));
    return products.filter((product) => !linked.has(String(product.id)));
  }, [products, department.profiles]);

  const applyDepartment = (updated?: Department | null) => {
    if (!updated) return;
    onDepartmentUpdate?.(updated);
  };

  const handleSaveProfiles = async (
    nextProfiles: DepartmentProfile[],
    successMessage: string,
  ) => {
    if (busyProfileId) return;
    setBusyProfileId("saving");
    try {
      const resp = await updateDepartment(department.id, {
        profiles: toProfileInputs(nextProfiles),
      });
      if (resp?.status === "SUCCESS") {
        applyDepartment(resp.data);
        await refetchDepartments?.();
        toast({ title: "Profiles updated", description: successMessage });
        return true;
      }
      toast({
        title: "Update failed",
        description: resp?.message || "Failed to update profiles",
        variant: "destructive",
      });
      return false;
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Unexpected error",
        variant: "destructive",
      });
      return false;
    } finally {
      setBusyProfileId(null);
    }
  };

  const handleAddProfile = async () => {
    const name = newProfileName.trim();
    if (!name) {
      toast({ title: "Profile name required", variant: "destructive" });
      return;
    }
    const ok = await handleSaveProfiles(
      [
        ...profiles,
        {
          id: "",
          name,
          isDefault: profiles.length === 0,
          products: newProfileProductIds
            .map((id) => newProfileProducts[id] || products.find((p) => String(p.id) === id))
            .filter((p): p is Product => Boolean(p)),
          createdAt: "",
          updatedAt: "",
        },
      ],
      `Profile "${name}" created`,
    );
    if (ok) {
      setAddingProfile(false);
      setNewProfileName("Default");
      setNewProfileProductIds([]);
      setNewProfileProducts({});
      setPendingProductId("");
      setPendingProduct(null);
    }
  };

  const handleRenameProfile = async (profileId: string) => {
    const name = renameValue.trim();
    if (!name) return;
    const ok = await handleSaveProfiles(
      profiles.map((profile) =>
        profile.id === profileId ? { ...profile, name } : profile,
      ),
      "Profile renamed",
    );
    if (ok) {
      setRenamingProfileId(null);
      setRenameValue("");
    }
  };

  const handleSetDefault = async (profileId: string) => {
    const ok = await handleSaveProfiles(
      profiles.map((profile) => ({
        ...profile,
        isDefault: profile.id === profileId,
      })),
      "Default profile updated",
    );
    if (ok) {
      toast({
        title: "Default profile set",
        description: "This profile is now marked as the department's default.",
      });
    }
  };

  const handleAddProductToProfile = async (profileId: string) => {
    if (!pendingProfileProductId) return;
    const product =
      pendingProfileProduct ||
      products.find((p) => String(p.id) === pendingProfileProductId);
    if (!product) return;
    const ok = await handleSaveProfiles(
      profiles.map((profile) =>
        profile.id === profileId
          ? {
              ...profile,
              products: product
                ? [...profile.products, product]
                : profile.products,
            }
          : profile,
      ),
      "Product added to profile",
    );
    if (ok) {
      setAddingToProfileId(null);
      setPendingProfileProductId("");
      setPendingProfileProduct(null);
    }
  };

  const handleRemoveProductFromProfile = async (
    profileId: string,
    productId: string,
  ) => {
    const ok = await handleSaveProfiles(
      profiles.map((profile) =>
        profile.id === profileId
          ? {
              ...profile,
              products: profile.products.filter(
                (product) => String(product.id) !== String(productId),
              ),
            }
          : profile,
      ),
      "Product removed from profile",
    );
    if (ok) {
      toast({ title: "Product removed", description: "Profile updated." });
    }
  };

  const handleRemoveProfile = async (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) return;
    if (!window.confirm(`Remove profile "${profile.name}" from this department?`)) {
      return;
    }
    setBusyProfileId(profileId);
    try {
      const resp = await removeDepartmentProfile(profileId);
      if (resp?.status === "SUCCESS") {
        applyDepartment(resp.data);
        await refetchDepartments?.();
        toast({ title: "Profile removed" });
      } else {
        toast({
          title: "Remove failed",
          description:
            resp?.message ||
            "This profile may still be in use by a visit. Switch those visits to another profile first.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Remove failed",
        description: err instanceof Error ? err.message : "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setBusyProfileId(null);
    }
  };

  const busy = updating || removing;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Profiles</h3>
        </div>
        {!addingProfile && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 rounded-full text-xs"
            onClick={() => setAddingProfile(true)}
            disabled={busy}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add profile
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Profiles are named product sets you can apply to a visit department to
        pre-fill its products. No profile is applied automatically — you choose
        one when adding the department to a visit.
      </p>

      {profiles.length === 0 && !addingProfile ? (
        <p className="text-xs text-muted-foreground rounded-lg border border-dashed p-4">
          No profiles yet. Add one to pre-fill departments with products.
        </p>
      ) : null}

      {addingProfile && (
        <div className="rounded-xl border bg-muted/20 p-3 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">
            New profile
          </p>
          <div>
            <label className="text-xs text-muted-foreground">Name</label>
            <Input
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="e.g. Standard OP Consultation"
              className="mt-1 h-9"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Products</label>
            <div className="flex items-center gap-2 mt-1">
              <ProductAutocomplete
                products={availableForProfile}
                selectedProductId={pendingProductId}
                onProductSelect={(id, product) => {
                  setPendingProductId(id);
                  setPendingProduct(product || null);
                }}
                placeholder="Search products..."
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (!pendingProductId) return;
                  setNewProfileProductIds((current) =>
                    current.includes(pendingProductId)
                      ? current
                      : [...current, pendingProductId],
                  );
                  if (pendingProduct) {
                    setNewProfileProducts((current) => ({
                      ...current,
                      [pendingProductId]: pendingProduct,
                    }));
                  }
                  setPendingProductId("");
                  setPendingProduct(null);
                }}
                disabled={!pendingProductId}
              >
                Add
              </Button>
            </div>
            <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
              {newProfileProductIds.map((productId) => {
                const product =
                  newProfileProducts[productId] ||
                  products.find((item) => String(item.id) === productId);
                return (
                  <div
                    key={productId}
                    className="flex items-center justify-between rounded-lg border px-3 py-1.5 bg-background"
                  >
                    <span className="text-xs font-medium">
                      {product?.name || productId}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setNewProfileProductIds((current) =>
                          current.filter((id) => id !== productId),
                        );
                        setNewProfileProducts((current) => {
                          const next = { ...current };
                          delete next[productId];
                          return next;
                        });
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
              {newProfileProductIds.length === 0 && (
                <p className="text-[11px] text-muted-foreground">
                  No products selected yet.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => {
                setAddingProfile(false);
                setNewProfileName("Default");
                setNewProfileProductIds([]);
                setNewProfileProducts({});
                setPendingProductId("");
                setPendingProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => void handleAddProfile()}
              disabled={busy || !newProfileName.trim()}
            >
              {busy ? "Saving…" : "Create profile"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {profiles.map((profile) => {
          const isRenaming = renamingProfileId === profile.id;
          const isAdding = addingToProfileId === profile.id;
          const profileProductIds = profile.products.map((p) => String(p.id));
          const addableProducts = products.filter(
            (product) => !profileProductIds.includes(String(product.id)),
          );
          return (
            <div
              key={profile.id}
              className="rounded-xl border bg-background p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                {isRenaming ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="h-8 text-sm flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleRenameProfile(profile.id);
                        if (e.key === "Escape") setRenamingProfileId(null);
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => void handleRenameProfile(profile.id)}
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setRenamingProfileId(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {profile.name}
                    </span>
                    {profile.isDefault && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] gap-1 shrink-0"
                      >
                        <Star className="h-3 w-3" /> Default
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {profile.products.length} product
                      {profile.products.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 shrink-0">
                  {!isRenaming && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      title="Rename profile"
                      onClick={() => {
                        setRenamingProfileId(profile.id);
                        setRenameValue(profile.name);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {!profile.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-full text-xs"
                      onClick={() => void handleSetDefault(profile.id)}
                      disabled={busy}
                    >
                      Set default
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    title="Remove profile"
                    disabled={busy}
                    onClick={() => void handleRemoveProfile(profile.id)}
                  >
                    {busyProfileId === profile.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                {profile.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-1.5"
                  >
                    <span className="text-xs font-medium">{product.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={busy}
                      onClick={() =>
                        void handleRemoveProductFromProfile(
                          profile.id,
                          String(product.id),
                        )
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {profile.products.length === 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    No products in this profile.
                  </p>
                )}
              </div>

              {isAdding ? (
                <div className="flex items-center gap-2">
                  <ProductAutocomplete
                    products={addableProducts}
                    selectedProductId={pendingProfileProductId}
                    onProductSelect={(id, product) => {
                      setPendingProfileProductId(id);
                      setPendingProfileProduct(product || null);
                    }}
                    placeholder="Search products..."
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => void handleAddProductToProfile(profile.id)}
                    disabled={!pendingProfileProductId || busy}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAddingToProfileId(null);
                      setPendingProfileProductId("");
                      setPendingProfileProduct(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 rounded-full text-xs"
                  onClick={() => setAddingToProfileId(profile.id)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add product
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {defaultProfile && profiles.length > 1 && (
        <p className="text-[11px] text-muted-foreground">
          Default profile: <span className="font-medium">{defaultProfile.name}</span>.
        </p>
      )}
    </div>
  );
}
