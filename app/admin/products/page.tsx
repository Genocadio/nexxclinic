"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import {
  useProductsPaginated,
  useInsurances,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useAddProductInsuranceCoverage,
  useRemoveProductInsuranceCoverage,
} from "@/hooks/auth-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Package,
  Pill,
  Stethoscope,
  FlaskConical,
  Boxes,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Settings,
  Search,
  Activity,
  ArrowRight,
  SlidersHorizontal,
  Coins,
  DollarSign,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/form-schemas";
import type {
  InsuranceProvider,
  Product,
  ProductInsuranceCoverage,
  ProductType,
} from "@/lib/api-types";
import { getBasePatientSharePercentage } from "@/lib/api-types";

const PRODUCT_TYPE_OPTIONS = [
  "DRUG",
  "MEDICAL_ACT",
  "BIOLOGICAL_ACT",
  "CONSUMABLE_DEVICE",
] as const;
type ProductTypeOption = (typeof PRODUCT_TYPE_OPTIONS)[number];

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 flex flex-col justify-between space-y-4 animate-pulse shadow-xs">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Skeleton className="size-10 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/3 rounded-md" />
            </div>
          </div>
          <Skeleton className="size-8 rounded-full shrink-0" />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    </div>
  );
}

function getProductTypeConfig(type?: string) {
  switch (type) {
    case "DRUG":
      return {
        label: "Drug / Pharmaceutical",
        shortLabel: "Drug",
        icon: Pill,
        badgeClass:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        iconContainerClass:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    case "MEDICAL_ACT":
      return {
        label: "Medical Act / Procedure",
        shortLabel: "Medical Act",
        icon: Stethoscope,
        badgeClass:
          "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20",
        iconContainerClass:
          "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      };
    case "BIOLOGICAL_ACT":
      return {
        label: "Biological / Lab Test",
        shortLabel: "Lab Test",
        icon: FlaskConical,
        badgeClass:
          "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        iconContainerClass:
          "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      };
    case "CONSUMABLE_DEVICE":
      return {
        label: "Consumable / Device",
        shortLabel: "Consumable",
        icon: Boxes,
        badgeClass:
          "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
        iconContainerClass:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
    default:
      return {
        label: type || "Product",
        shortLabel: type || "Product",
        icon: Package,
        badgeClass: "bg-primary/15 text-primary border-primary/20",
        iconContainerClass: "bg-primary/10 text-primary",
      };
  }
}

export default function ManageProductsPage() {
  const router = useRouter();
  const { doctor } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchName, setDebouncedSearchName] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Selection / Tab state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>("settings");

  // Debounced search-as-you-type
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchName(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Query hook
  const {
    products,
    loading: productsLoading,
    error: productsError,
    hasMore,
    loadMore,
    refresh,
    pagination,
  } = useProductsPaginated({
    name: debouncedSearchName || undefined,
    type: filterType !== "ALL" ? (filterType as ProductType) : undefined,
    size: 30,
  });

  const { insurances, loading: insurancesLoading } = useInsurances();

  // Infinite scroll observer setup
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingMoreRef = useRef(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!hasMore || selectedProduct) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !isFetchingMoreRef.current &&
          hasMore &&
          !productsLoading
        ) {
          isFetchingMoreRef.current = true;
          setLoadingMore(true);
          try {
            await loadMore();
          } finally {
            isFetchingMoreRef.current = false;
            setLoadingMore(false);
          }
        }
      },
      { root: null, rootMargin: "300px", threshold: 0.05 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, productsLoading, selectedProduct, loadMore]);

  // Mutations
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();
  const { deleteProduct } = useDeleteProduct();
  const { addCoverage } = useAddProductInsuranceCoverage();
  const { removeCoverage } = useRemoveProductInsuranceCoverage();

  const [saving, setSaving] = useState(false);

  // Settings tab form state
  const [settingsName, setSettingsName] = useState("");
  const [settingsCode, setSettingsCode] = useState("");
  const [settingsDescription, setSettingsDescription] = useState("");
  const [settingsType, setSettingsType] = useState<ProductTypeOption>("MEDICAL_ACT");
  const [settingsPrivatePrice, setSettingsPrivatePrice] = useState("");
  const [settingsClinicPrice, setSettingsClinicPrice] = useState("");
  const [settingsQuantifiable, setSettingsQuantifiable] = useState(true);

  // Insurance coverage tab state
  const [newCoverageInsuranceId, setNewCoverageInsuranceId] = useState("");
  const [newCoveragePrice, setNewCoveragePrice] = useState("");

  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form for creation
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreateForm,
    setValue: setCreateValue,
    watch: watchCreate,
    formState: { errors: createErrors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      type: "MEDICAL_ACT",
      privatePrice: "",
      clinicPrice: "",
      quantifiable: true,
    },
  });
  const watchedCreateType = watchCreate("type");

  // Quick Metrics stats
  const stats = useMemo(() => {
    const total = pagination?.totalElements || products.length;
    const medicalActsCount = products.filter(
      (p: Product) => p.type === "MEDICAL_ACT",
    ).length;
    const drugsCount = products.filter((p: Product) => p.type === "DRUG").length;
    const labActsCount = products.filter(
      (p: Product) => p.type === "BIOLOGICAL_ACT",
    ).length;
    const consumablesCount = products.filter(
      (p: Product) => p.type === "CONSUMABLE_DEVICE",
    ).length;
    return {
      total,
      medicalActsCount,
      drugsCount,
      labActsCount,
      consumablesCount,
      otherCount: labActsCount + consumablesCount,
    };
  }, [products, pagination]);

  // Handle selecting product into workspace view
  const handleSelectProduct = (product: Product, tab: string = "settings") => {
    setSelectedProduct(product);
    setActiveTab(tab);
    setSettingsName(product.name || "");
    setSettingsCode(product.code || "");
    setSettingsDescription(product.description || "");
    const incomingType = String(
      product.type || "",
    ).toUpperCase() as ProductTypeOption;
    setSettingsType(
      PRODUCT_TYPE_OPTIONS.includes(incomingType)
        ? incomingType
        : "MEDICAL_ACT",
    );
    setSettingsPrivatePrice(
      product.privateRhicPrice !== null && product.privateRhicPrice !== undefined
        ? String(product.privateRhicPrice)
        : "",
    );
    setSettingsClinicPrice(
      product.clinicPrice ? String(product.clinicPrice) : "",
    );
    setSettingsQuantifiable(product.quantifiable !== false);
    setNewCoverageInsuranceId("");
    setNewCoveragePrice("");
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
  };

  // Available insurances to link for the selected product
  const availableInsurancesForProduct = useMemo(() => {
    if (!selectedProduct) return insurances;
    const linkedIds = new Set(
      (selectedProduct.insuranceCoverages || []).map((c) =>
        String(c.insuranceProvider?.id),
      ),
    );
    return insurances.filter(
      (ins: InsuranceProvider) => !linkedIds.has(String(ins.id)),
    );
  }, [insurances, selectedProduct]);

  // Handle Create Product
  const handleCreateProduct = async (values: ProductFormValues) => {
    setSaving(true);
    try {
      const createdResp = await createProduct({
        name: values.name,
        code:
          values.name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-") || `product-${Date.now()}`,
        description: values.description || values.name,
        type: values.type as ProductTypeOption,
        unit: "PCS",
        privateRhicPrice: Number(values.privatePrice),
        clinicPrice: values.clinicPrice
          ? Number(values.clinicPrice)
          : undefined,
        quantifiable: values.quantifiable !== false,
        insuranceCoverages: [],
      });
      await refresh();
      if (createdResp?.status === "SUCCESS") {
        toast.success(
          createdResp.message || "Product created successfully!",
        );
        resetCreateForm();
        setIsCreateModalOpen(false);
        if (createdResp.data) {
          handleSelectProduct(createdResp.data, "settings");
        }
      } else {
        toast.error(createdResp?.message || "Failed to create product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  // Handle Save Settings in Tab 1
  const handleSaveSettings = async () => {
    if (!selectedProduct) return;
    if (!settingsName.trim()) {
      toast.error("Product name is required");
      return;
    }
    const privPriceNum = Number(settingsPrivatePrice);
    if (isNaN(privPriceNum) || privPriceNum < 0) {
      toast.error("Private price must be a valid non-negative number");
      return;
    }

    setSaving(true);
    try {
      const updatedResp = await updateProduct(selectedProduct.id, {
        name: settingsName.trim(),
        code:
          settingsCode.trim() ||
          settingsName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),
        description: settingsDescription.trim() || settingsName.trim(),
        type: settingsType,
        unit: selectedProduct.unit || "PCS",
        privateRhicPrice: privPriceNum,
        clinicPrice: settingsClinicPrice
          ? Number(settingsClinicPrice)
          : undefined,
        quantifiable: settingsQuantifiable,
      });
      await refresh();
      if (updatedResp?.status === "SUCCESS") {
        toast.success(
          updatedResp.message || "Product updated successfully!",
        );
        const updatedData = updatedResp.data;
        setSelectedProduct({
          ...selectedProduct,
          ...(updatedData || {}),
          name: settingsName.trim(),
          code: settingsCode.trim() || selectedProduct.code,
          description: settingsDescription.trim(),
          type: settingsType as ProductType,
          privateRhicPrice: privPriceNum,
          clinicPrice: settingsClinicPrice
            ? Number(settingsClinicPrice)
            : undefined,
          quantifiable: settingsQuantifiable,
        });
      } else {
        toast.error(updatedResp?.message || "Failed to update product");
      }
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  // Handle Add Coverage in Tab 2
  const handleAddCoverage = async () => {
    if (!selectedProduct || !newCoverageInsuranceId || !newCoveragePrice)
      return;
    const priceNum = Number(newCoveragePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setSaving(true);
    try {
      const resultResp = await addCoverage(
        selectedProduct.id,
        newCoverageInsuranceId,
        priceNum,
      );
      await refresh();
      if (resultResp?.status === "SUCCESS") {
        toast.success(
          resultResp.message || "Insurance coverage added successfully!",
        );
        setNewCoverageInsuranceId("");
        setNewCoveragePrice("");
        if (resultResp.data) setSelectedProduct(resultResp.data);
      } else {
        toast.error(resultResp?.message || "Failed to add coverage");
      }
    } catch {
      toast.error("Failed to add coverage");
    } finally {
      setSaving(false);
    }
  };

  // Handle Remove Coverage in Tab 2
  const handleRemoveCoverage = async (insuranceId: string) => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      const targetCov = selectedProduct.insuranceCoverages?.find(
        (cov: ProductInsuranceCoverage) =>
          String(cov.insuranceProvider?.id) === String(insuranceId),
      );
      if (!targetCov) {
        toast.error("Coverage not found");
        return;
      }
      const resp = await removeCoverage(targetCov.id);
      await refresh();
      if (resp?.status === "SUCCESS") {
        toast.success(
          resp.message || "Insurance coverage removed successfully!",
        );
        setSelectedProduct({
          ...selectedProduct,
          insuranceCoverages: (
            selectedProduct.insuranceCoverages || []
          ).filter(
            (cov: ProductInsuranceCoverage) =>
              String(cov.insuranceProvider?.id) !== String(insuranceId),
          ),
        });
      } else {
        toast.error(resp?.message || "Failed to remove coverage");
      }
    } catch {
      toast.error("Failed to remove coverage");
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async () => {
    const targetId = deleteTargetId || selectedProduct?.id;
    if (!targetId) return;

    setSaving(true);
    try {
      const resp = await deleteProduct(targetId);
      await refresh();
      if (resp?.status === "SUCCESS") {
        toast.success(resp.message || "Product deleted successfully!");
        if (selectedProduct && selectedProduct.id === targetId) {
          setSelectedProduct(null);
        }
      } else {
        toast.error(resp?.message || "Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setSaving(false);
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  // Coverage statistics for Tab 3 Overview
  const coverageStats = useMemo(() => {
    if (!selectedProduct?.insuranceCoverages?.length) return null;
    const costs = selectedProduct.insuranceCoverages.map((c) => c.cost || 0);
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const avgCost = Math.round(
      costs.reduce((acc, v) => acc + v, 0) / costs.length,
    );
    return { minCost, maxCost, avgCost, count: costs.length };
  }, [selectedProduct]);

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {!selectedProduct ? (
          /* ========================================================================= */
          /* VIEW A: PRODUCTS CATALOG & GRID VIEW                                     */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Top Navigation & Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    Product & Services Management
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Configure clinical acts, pharmaceuticals, procedures, private pricing, and insurance coverage tariffs.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  resetCreateForm();
                  setIsCreateModalOpen(true);
                }}
                className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium px-5"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Products
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {stats.total}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  In clinic catalog
                </p>
              </div>
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                  <Stethoscope className="h-3.5 w-3.5" /> Medical Acts
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {stats.medicalActsCount}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Procedures & consults
                </p>
              </div>
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Pill className="h-3.5 w-3.5" /> Pharmaceuticals
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {stats.drugsCount}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Medicines & drugs
                </p>
              </div>
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <FlaskConical className="h-3.5 w-3.5" /> Labs & Devices
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {stats.otherCount}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lab tests & consumables
                </p>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name or code..."
                  className="pl-9 rounded-xl bg-card w-full shadow-xs"
                />
              </div>

              <div className="w-full sm:w-56 shrink-0">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="rounded-xl bg-card shadow-xs">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {PRODUCT_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {getProductTypeConfig(opt).shortLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {productsLoading && products.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl bg-muted/10 space-y-3">
                <Package className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="text-base font-semibold">No products found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {searchQuery || filterType !== "ALL"
                    ? "No products match your search or filter criteria."
                    : "Get started by adding your first product to the clinic catalog."}
                </p>
                {!searchQuery && filterType === "ALL" && (
                  <Button
                    onClick={() => {
                      resetCreateForm();
                      setIsCreateModalOpen(true);
                    }}
                    size="sm"
                    className="rounded-full mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1.5" /> Add First Product
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((item: Product) => {
                    const typeConfig = getProductTypeConfig(item.type);
                    const TypeIcon = typeConfig.icon;
                    const insuranceCount =
                      item.insuranceCoverages?.length || 0;
                    const isQuantifiable = item.quantifiable !== false;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectProduct(item, "settings")}
                        className="group relative rounded-2xl border border-border/70 bg-card hover:bg-card/90 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer p-5 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Header & Badges */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={cn(
                                  "size-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0",
                                  typeConfig.iconContainerClass,
                                )}
                              >
                                <TypeIcon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate">
                                  Code: {item.code || "—"}
                                </p>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full shrink-0"
                                >
                                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleSelectProduct(item, "settings")
                                  }
                                >
                                  <Settings className="h-4 w-4 mr-2" /> Details & Pricing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleSelectProduct(item, "insurances")
                                  }
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" /> Insurances ({insuranceCount})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleSelectProduct(item, "overview")
                                  }
                                >
                                  <Activity className="h-4 w-4 mr-2" /> Overview & Audit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTargetId(item.id);
                                    setDeleteConfirmOpen(true);
                                  }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete Product
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Capabilities & Operational Badges */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <Badge
                              variant="secondary"
                              className={cn("text-[11px] gap-1", typeConfig.badgeClass)}
                            >
                              <TypeIcon className="h-3 w-3" />
                              {typeConfig.shortLabel}
                            </Badge>

                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[11px] gap-1",
                                isQuantifiable
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
                              )}
                            >
                              {isQuantifiable ? "Variable Qty" : "Fixed Qty = 1"}
                            </Badge>

                            {insuranceCount > 0 ? (
                              <Badge
                                variant="secondary"
                                className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 text-[11px] gap-1"
                              >
                                <Shield className="h-3 w-3" />
                                {insuranceCount} insurance{insuranceCount > 1 ? "s" : ""}
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[11px] text-muted-foreground gap-1"
                              >
                                No insurance
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Footer / Price & Manage */}
                        <div className="flex items-center justify-between pt-4 mt-3 border-t border-border/50 text-xs text-muted-foreground">
                          <div className="font-semibold text-foreground text-sm flex items-center gap-1">
                            <Coins className="h-4 w-4 text-primary" />
                            {item.privateRhicPrice?.toLocaleString() ?? 0}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              RWF
                            </span>
                          </div>

                          <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Manage <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Skeletons while loading more during continuous infinite scroll */}
                  {(loadingMore || (productsLoading && products.length > 0)) && (
                    <>
                      <ProductCardSkeleton />
                      <ProductCardSkeleton />
                      <ProductCardSkeleton />
                    </>
                  )}
                </div>

                {/* Infinite scroll sentinel */}
                {hasMore && (
                  <div
                    ref={sentinelRef}
                    className="h-10 w-full flex items-center justify-center pt-2 pointer-events-none"
                  >
                    {loadingMore && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="size-2 bg-primary rounded-full animate-bounce" />
                        <span>Loading more products...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* All products loaded footer */}
                {!hasMore && products.length > 0 && (
                  <div className="text-center py-6 border-t border-border/40">
                    <p className="text-xs text-muted-foreground">
                      All {pagination?.totalElements || products.length} products loaded.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW B: DEDICATED FULL-SCREEN PRODUCT TABBED WORKSPACE                   */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Top Workspace Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToCatalog}
                  className="rounded-full shrink-0 gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" /> All Products
                </Button>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {(() => {
                      const cfg = getProductTypeConfig(selectedProduct.type);
                      const Icon = cfg.icon;
                      return (
                        <>
                          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <div
                              className={cn(
                                "size-8 rounded-lg flex items-center justify-center",
                                cfg.iconContainerClass,
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            {selectedProduct.name}
                          </h1>

                          <Badge
                            className={cn(
                              "text-xs gap-1",
                              cfg.badgeClass,
                            )}
                          >
                            <Icon className="h-3 w-3" />
                            {cfg.shortLabel}
                          </Badge>

                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs gap-1",
                              selectedProduct.quantifiable !== false
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
                            )}
                          >
                            {selectedProduct.quantifiable !== false
                              ? "Variable Qty"
                              : "Fixed Qty = 1"}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="text-xs font-semibold"
                          >
                            {selectedProduct.privateRhicPrice?.toLocaleString() ?? 0} RWF
                          </Badge>
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure product specifications, base private tariff, and insurance provider coverage tariffs.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Tabs Container */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="bg-muted/60 p-1 rounded-xl h-auto grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-2xl">
                <TabsTrigger
                  value="settings"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <Settings className="h-4 w-4" />
                  Details & Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="insurances"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Insurances
                  {(selectedProduct.insuranceCoverages || []).length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-[10px] px-1.5 py-0 h-4"
                    >
                      {(selectedProduct.insuranceCoverages || []).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <Activity className="h-4 w-4" />
                  Overview & Audit
                </TabsTrigger>
                <TabsTrigger
                  value="danger"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs text-destructive data-[state=active]:text-destructive"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Danger Zone
                </TabsTrigger>
              </TabsList>

              {/* ------------------------------------------------------------- */}
              {/* TAB 1: DETAILS & PRICING                                      */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Product Information & Base Pricing
                    </CardTitle>
                    <CardDescription>
                      Update the product identification details, classification, quantifiable usage behavior, and private RHIC price.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Product Name *
                        </Label>
                        <Input
                          value={settingsName}
                          onChange={(e) => setSettingsName(e.target.value)}
                          placeholder="e.g. Paracetamol 500mg, General Consultation"
                          className="rounded-xl"
                        />
                      </div>

                      {/* Code */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Product Code *
                        </Label>
                        <Input
                          value={settingsCode}
                          onChange={(e) => setSettingsCode(e.target.value)}
                          placeholder="e.g. med-paracetamol-500, act-consultation"
                          className="rounded-xl"
                        />
                      </div>

                      {/* Type */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Product Classification *
                        </Label>
                        <Select
                          value={settingsType}
                          onValueChange={(val) =>
                            setSettingsType(val as ProductTypeOption)
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_TYPE_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {getProductTypeConfig(opt).label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Private Price */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Private RHIC Price (RWF) *
                        </Label>
                        <Input
                          type="number"
                          step="any"
                          value={settingsPrivatePrice}
                          onChange={(e) =>
                            setSettingsPrivatePrice(e.target.value)
                          }
                          placeholder="e.g. 5000"
                          className="rounded-xl"
                        />
                      </div>

                      {/* Clinic Internal Price */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Clinic Internal Price (RWF, Optional)
                        </Label>
                        <Input
                          type="number"
                          step="any"
                          value={settingsClinicPrice}
                          onChange={(e) =>
                            setSettingsClinicPrice(e.target.value)
                          }
                          placeholder="e.g. 3000"
                          className="rounded-xl"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Description (Optional)
                        </Label>
                        <Input
                          value={settingsDescription}
                          onChange={(e) =>
                            setSettingsDescription(e.target.value)
                          }
                          placeholder="Enter brief description or clinical guidance"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Quantifiable Switch */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/70 bg-muted/20 p-5 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Boxes className="h-4 w-4 text-primary" />
                          <p className="text-sm font-semibold text-foreground">
                            Quantifiable Usage (Variable Quantity)
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                          When enabled, clinicians and staff can specify variable quantity (e.g. 3 tablets, 2 ampoules). When disabled, the quantity is always locked to 1 (e.g. single procedure, fixed consultation act).
                        </p>
                      </div>
                      <Switch
                        checked={settingsQuantifiable}
                        onCheckedChange={setSettingsQuantifiable}
                      />
                    </div>

                    {/* Save Action */}
                    <div className="pt-4 border-t border-border/60 flex justify-end">
                      <Button
                        onClick={handleSaveSettings}
                        disabled={saving || !settingsName.trim()}
                        className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium"
                      >
                        {saving ? "Saving…" : "Save Product Details"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: INSURANCES                                             */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="insurances" className="space-y-6">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Insurance Provider Coverage & Tariffs
                    </CardTitle>
                    <CardDescription>
                      Configure negotiated tariffs and coverage rates for each health insurance partner accepted by the clinic.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Active Insurance Coverages List */}
                    {selectedProduct.insuranceCoverages &&
                    selectedProduct.insuranceCoverages.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground">
                          Configured Insurance Tariffs (
                          {selectedProduct.insuranceCoverages.length})
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {selectedProduct.insuranceCoverages.map(
                            (cov: ProductInsuranceCoverage) => {
                              const provider = cov.insuranceProvider;
                              const patientShare = provider
                                ? getBasePatientSharePercentage(provider)
                                : 0;

                              return (
                                <div
                                  key={cov.id}
                                  className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-4 hover:border-border transition-all"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Shield className="h-4 w-4 text-blue-500" />
                                      <p className="font-semibold text-sm text-foreground">
                                        {provider?.name || provider?.insuranceName}
                                      </p>
                                      {provider?.acronym && (
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px]"
                                        >
                                          {provider.acronym}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Insurance Tariff:{" "}
                                      <strong className="text-foreground">
                                        {cov.cost?.toLocaleString() ?? 0} RWF
                                      </strong>{" "}
                                      • Base Co-pay: {patientShare}%
                                    </p>
                                  </div>

                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full hover:bg-destructive/10 text-destructive"
                                    onClick={() =>
                                      handleRemoveCoverage(provider?.id)
                                    }
                                    disabled={saving}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed rounded-xl bg-muted/10 space-y-2">
                        <Shield className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm font-medium text-foreground">
                          No insurance tariffs configured
                        </p>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto">
                          Patients using insurance will be billed standard private RHIC price unless an insurance-specific tariff is added below.
                        </p>
                      </div>
                    )}

                    {/* Add New Insurance Coverage Section */}
                    <div className="border-t border-border/60 pt-6 space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Plus className="h-4 w-4 text-primary" /> Add Insurance Tariff
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Select an insurance partner and specify the agreed billing tariff for this product.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            Insurance Partner *
                          </Label>
                          <Select
                            value={newCoverageInsuranceId}
                            onValueChange={setNewCoverageInsuranceId}
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select insurance provider" />
                            </SelectTrigger>
                            <SelectContent>
                              {insurancesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading providers...
                                </SelectItem>
                              ) : availableInsurancesForProduct.length === 0 ? (
                                <SelectItem value="none" disabled>
                                  All insurance providers configured
                                </SelectItem>
                              ) : (
                                availableInsurancesForProduct.map(
                                  (ins: InsuranceProvider) => (
                                    <SelectItem
                                      key={ins.id}
                                      value={ins.id.toString()}
                                    >
                                      {ins.name} ({ins.acronym})
                                    </SelectItem>
                                  ),
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            Agreed Tariff (RWF) *
                          </Label>
                          <Input
                            type="number"
                            step="any"
                            placeholder="Enter coverage price"
                            value={newCoveragePrice}
                            onChange={(e) => setNewCoveragePrice(e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <Button
                          onClick={handleAddCoverage}
                          disabled={
                            saving ||
                            !newCoverageInsuranceId ||
                            !newCoveragePrice
                          }
                          className="rounded-full px-5 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-sm font-medium"
                        >
                          <Plus className="h-4 w-4 mr-1.5" /> Add Tariff
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------------------------------------------------------- */}
              {/* TAB 3: OVERVIEW & AUDIT                                       */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Pricing Comparison Card */}
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Coins className="h-4 w-4 text-primary" /> Pricing Summary
                      </CardTitle>
                      <CardDescription>
                        Overview of base private price and insurance tariff metrics.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">Private RHIC Price:</span>
                        <strong className="text-foreground">
                          {selectedProduct.privateRhicPrice?.toLocaleString() ?? 0} RWF
                        </strong>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">Clinic Internal Price:</span>
                        <strong className="text-foreground">
                          {selectedProduct.clinicPrice
                            ? `${selectedProduct.clinicPrice.toLocaleString()} RWF`
                            : "Not specified"}
                        </strong>
                      </div>

                      {coverageStats ? (
                        <>
                          <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                            <span className="text-muted-foreground">Average Insurance Tariff:</span>
                            <strong className="text-foreground">
                              {coverageStats.avgCost.toLocaleString()} RWF
                            </strong>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                            <span className="text-muted-foreground">Tariff Range:</span>
                            <strong className="text-foreground">
                              {coverageStats.minCost.toLocaleString()} - {coverageStats.maxCost.toLocaleString()} RWF
                            </strong>
                          </div>
                        </>
                      ) : (
                        <div className="py-2 text-xs text-muted-foreground italic">
                          No insurance tariffs active for pricing comparisons.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Identification & Metadata Card */}
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" /> System Identifiers
                      </CardTitle>
                      <CardDescription>
                        Internal database identifiers and audit timestamps.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">System ID:</span>
                        <span className="font-mono text-xs text-foreground bg-muted/40 px-2 py-0.5 rounded">
                          {selectedProduct.id}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">Product Code:</span>
                        <span className="font-mono text-xs text-foreground bg-muted/40 px-2 py-0.5 rounded">
                          {selectedProduct.code || "—"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">Classification:</span>
                        <Badge variant="secondary" className="text-xs">
                          {getProductTypeConfig(selectedProduct.type).label}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">Quantifiable:</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            selectedProduct.quantifiable !== false
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                          )}
                        >
                          {selectedProduct.quantifiable !== false ? "Yes (Variable)" : "No (Fixed = 1)"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ------------------------------------------------------------- */}
              {/* TAB 4: DANGER ZONE                                            */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="danger" className="space-y-6">
                <Card className="border-destructive/40 bg-destructive/5 dark:bg-destructive/10 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5" /> Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible actions for this product in the clinic database.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-background/50">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          Delete this product
                        </p>
                        <p className="text-xs text-muted-foreground max-w-lg">
                          Permanently remove this product from the clinic catalog. Associated insurance coverages will also be removed.
                        </p>
                      </div>

                      <Button
                        variant="destructive"
                        className="rounded-full px-5 shrink-0"
                        onClick={() => {
                          setDeleteTargetId(selectedProduct.id);
                          setDeleteConfirmOpen(true);
                        }}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD PRODUCT MODAL                                                         */}
        {/* ========================================================================= */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-2xl bg-card/95 dark:bg-card/95 text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-3 flex flex-col">
            <div className="flex-1 overflow-hidden bg-[#FBF2ED] dark:bg-slate-900 border border-border/40 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Create New Product
                </DialogTitle>
                <DialogDescription>
                  Enter product details, category classification, and base private RHIC price.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmitCreate(handleCreateProduct)}
                className="flex-1 overflow-y-auto pr-2 space-y-4 my-4 scrollbar-thin"
              >
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Product Name *
                  </Label>
                  <Input
                    placeholder="e.g. Paracetamol 500mg, Full Blood Count"
                    {...registerCreate("name")}
                    className={`rounded-xl bg-white dark:bg-slate-950 ${createErrors.name ? "border-red-500 focus-visible:ring-red-300" : ""}`}
                  />
                  <FieldError message={createErrors.name?.message} />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Description (Optional)
                  </Label>
                  <Input
                    placeholder="Brief description or usage instructions"
                    {...registerCreate("description")}
                    className="rounded-xl bg-white dark:bg-slate-950"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Product Type *
                    </Label>
                    <Select
                      value={watchedCreateType}
                      onValueChange={(val) =>
                        setCreateValue("type", val, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger className="rounded-xl bg-white dark:bg-slate-950">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {getProductTypeConfig(opt).label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={createErrors.type?.message} />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Private RHIC Price (RWF) *
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="e.g. 5000"
                      {...registerCreate("privatePrice")}
                      className={`rounded-xl bg-white dark:bg-slate-950 ${createErrors.privatePrice ? "border-red-500 focus-visible:ring-red-300" : ""}`}
                    />
                    <FieldError message={createErrors.privatePrice?.message} />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Clinic Internal Price (RWF, Optional)
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="e.g. 3500"
                      {...registerCreate("clinicPrice")}
                      className="rounded-xl bg-white dark:bg-slate-950"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-border/40 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    disabled={saving}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium"
                  >
                    {saving ? "Creating…" : "Create Product"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone and will delete all associated insurance coverage tariffs."
          confirmLabel="Delete Product"
          destructive
          busy={saving}
          onConfirm={handleDeleteProduct}
        />
      </main>
    </div>
  );
}
