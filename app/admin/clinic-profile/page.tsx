"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"
import { getClinicDisplayName, getClinicLogoUrl } from "@/lib/clinic-profile"
import { useClinicProfile, useUpsertClinicProfile } from "@/hooks/auth-hooks"
import { ArrowLeft, Image as ImageIcon, Save, ShieldCheck, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { canManageAdminUsers } from "@/lib/role-utils"

type ClinicContact = {
  contactType: "PHONE" | "EMAIL" | "POBOX"
  value: string
  description: string
}

const CONTACT_TYPES: ClinicContact["contactType"][] = ["PHONE", "EMAIL", "POBOX"]

const prettyJson = (value: unknown) => {
  if (value == null) return ""
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

const normalizeContacts = (value: unknown): ClinicContact[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null

      const contact = item as Partial<ClinicContact> & { contactType?: unknown; value?: unknown; description?: unknown }
      const contactType = CONTACT_TYPES.includes(contact.contactType as ClinicContact["contactType"]) ? (contact.contactType as ClinicContact["contactType"]) : null
      const contactValue = typeof contact.value === "string" ? contact.value.trim() : ""
      if (!contactType || !contactValue) return null

      return {
        contactType,
        value: contactValue,
        description: typeof contact.description === "string" ? contact.description : "",
      }
    })
    .filter((item): item is ClinicContact => item !== null)
}

export default function ClinicProfilePage() {
  const router = useRouter()
  const { doctor, clinicProfile, setClinicProfile } = useAuth()
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const canAccess = canManageAdminUsers(roles)

  const { clinicProfile: loadedClinicProfile, loading, error, refetch } = useClinicProfile()
  const { upsertClinicProfile, loading: saving } = useUpsertClinicProfile()

  const sourceProfile = clinicProfile || loadedClinicProfile
  const sourceProfileSignature = useMemo(() => {
    if (!sourceProfile) return ""

    return JSON.stringify({
      id: sourceProfile.id,
      name: sourceProfile.name || "",
      address: sourceProfile.address || "",
      tinNumber: sourceProfile.tinNumber || "",
      logoUrl: sourceProfile.logoUrl || "",
      contacts: sourceProfile.contacts || [],
      metadata: sourceProfile.metadata || {},
    })
  }, [sourceProfile])

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [tinNumber, setTinNumber] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [contacts, setContacts] = useState<ClinicContact[]>([])
  const [metadataPairs, setMetadataPairs] = useState<{ key: string; value: string }[]>([])

  useEffect(() => {
    setName(sourceProfile?.name || "")
    setAddress(sourceProfile?.address || "")
    setTinNumber(sourceProfile?.tinNumber || "")
    setLogoUrl(sourceProfile?.logoUrl || "")
    setContacts(normalizeContacts(sourceProfile?.contacts))
    const meta = sourceProfile?.metadata || null
    if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
      setMetadataPairs(Object.entries(meta as Record<string, string>).map(([k, v]) => ({ key: k, value: String(v) })))
    } else {
      setMetadataPairs([])
    }
  }, [sourceProfileSignature])

  const previewName = useMemo(() => getClinicDisplayName({ ...sourceProfile, name } as any), [name, sourceProfile])
  const previewLogo = useMemo(() => getClinicLogoUrl({ ...sourceProfile, logoUrl } as any), [logoUrl, sourceProfile])

  const updateContact = (index: number, field: keyof ClinicContact, value: string) => {
    setContacts((current) => current.map((contact, contactIndex) => (contactIndex === index ? { ...contact, [field]: value } : contact)))
  }

  const addContact = () => {
    setContacts((current) => [...current, { contactType: "PHONE", value: "", description: "" }])
  }

  const removeContact = (index: number) => {
    setContacts((current) => current.filter((_, contactIndex) => contactIndex !== index))
  }

  const handleSave = async () => {
    try {
      const response = await upsertClinicProfile({
        name: name.trim() || undefined,
        address: address.trim() || undefined,
        tinNumber: tinNumber.trim() || undefined,
        logoUrl: logoUrl.trim() || undefined,
        contacts: contacts
          .map((contact) => ({
            contactType: contact.contactType,
            value: contact.value.trim(),
            description: contact.description.trim() || undefined,
          }))
          .filter((contact) => contact.value),
        metadata: metadataPairs.reduce((acc, { key, value }) => {
          const k = key?.trim()
          if (!k) return acc
          acc[k] = value
          return acc
        }, {} as { [key: string]: string }),
      })

      if (response.status === "SUCCESS") {
        if (response.data) {
          setClinicProfile(response.data)
        }
        await refetch()
        toast.success(response.message || "Clinic profile updated")
      } else {
        toast.error(response.message || "Failed to update clinic profile")
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update clinic profile")
    }
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header doctor={doctor} />
        <main className="max-w-3xl mx-auto px-6 py-16 text-center space-y-3">
          <ShieldCheck className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">Access restricted</h1>
          <p className="text-muted-foreground">Only admins can manage clinic profile settings.</p>
          <Button onClick={() => router.push("/admin")} className="rounded-full">
            Back to Admin Dashboard
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header doctor={doctor} />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Clinic Profile Management</h1>
              <p className="text-muted-foreground">Read and update clinic branding, contact, tax, and metadata values.</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="rounded-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-1 bg-card/70 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-lg space-y-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Brand preview</p>
              <p className="text-xs text-muted-foreground mt-1">This is what users will see in the header and auth pages.</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 p-4 bg-background/60">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
                <img src={previewLogo} alt={`${previewName} logo`} className="h-14 w-14 object-contain" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{previewName}</p>
                <p className="text-xs text-muted-foreground truncate">{address || "No address set"}</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : sourceProfile ? (
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-border/50 p-4 bg-background/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Clinic name</p>
                  <p className="font-medium text-foreground mt-1">{sourceProfile.name || "-"}</p>
                </div>
                <div className="rounded-2xl border border-border/50 p-4 bg-background/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">TIN number</p>
                  <p className="font-medium text-foreground mt-1">{sourceProfile.tinNumber || "-"}</p>
                </div>
                <div className="rounded-2xl border border-border/50 p-4 bg-background/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Logo URL</p>
                  <p className="font-medium text-foreground mt-1 break-all">{sourceProfile.logoUrl || "-"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No clinic profile returned yet. Fill the form on the right to create/update it.</p>
            )}
          </section>

          <section className="xl:col-span-2 bg-card/70 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-lg space-y-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Editable profile fields</p>
              <p className="text-xs text-muted-foreground mt-1">Leave optional fields blank to fall back to the default med branding.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground">Clinic name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Clinic name" className="rounded-xl" />
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground">TIN number</label>
                <Input value={tinNumber} onChange={(e) => setTinNumber(e.target.value)} placeholder="TIN number" className="rounded-xl" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">Address</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Clinic address" className="rounded-xl" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">Logo URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://... or /local-logo.png" className="rounded-xl pl-9" />
                </div>
              </div>
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold text-muted-foreground">Contacts</label>
                  <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={addContact}>
                    Add contact
                  </Button>
                </div>
                <div className="space-y-3">
                  {contacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border/60 bg-background/60 p-4">
                      No contacts added yet.
                    </p>
                  ) : null}
                  {contacts.map((contact, index) => (
                    <div key={`${contact.contactType}-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-2xl border border-border/50 bg-background/60 p-4">
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-[11px] font-semibold text-muted-foreground">Type</label>
                        <select
                          value={contact.contactType}
                          onChange={(e) => updateContact(index, "contactType", e.target.value)}
                          className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                        >
                          {CONTACT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-[11px] font-semibold text-muted-foreground">Value</label>
                        <Input value={contact.value} onChange={(e) => updateContact(index, "value", e.target.value)} placeholder="Contact value" className="rounded-xl" />
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-[11px] font-semibold text-muted-foreground">Description</label>
                        <Input value={contact.description} onChange={(e) => updateContact(index, "description", e.target.value)} placeholder="Optional note" className="rounded-xl" />
                      </div>
                      <div className="md:col-span-1 flex items-center justify-end">
                        <Button type="button" variant="ghost" size="icon" className="rounded-full text-destructive hover:text-destructive" onClick={() => removeContact(index)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold text-muted-foreground">Metadata</label>
                  <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setMetadataPairs((p) => [...p, { key: "", value: "" }])}>
                    Add metadata
                  </Button>
                </div>
                <div className="space-y-3">
                  {metadataPairs.length === 0 ? (
                    <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border/60 bg-background/60 p-4">No metadata set.</p>
                  ) : null}
                  {metadataPairs.map((pair, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-5">
                        <Input value={pair.key} onChange={(e) => setMetadataPairs((cur) => cur.map((c, i) => (i === idx ? { ...c, key: e.target.value } : c)))} placeholder="Key" className="rounded-xl" />
                      </div>
                      <div className="col-span-6">
                        <Input value={pair.value} onChange={(e) => setMetadataPairs((cur) => cur.map((c, i) => (i === idx ? { ...c, value: e.target.value } : c)))} placeholder="Value" className="rounded-xl" />
                      </div>
                      <div className="col-span-1 flex items-center justify-end">
                        <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => setMetadataPairs((cur) => cur.filter((_, i) => i !== idx))}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/50 flex-wrap">
              <p className="text-xs text-muted-foreground">Changes apply immediately after save and are persisted for future logins.</p>
              <Button onClick={handleSave} disabled={saving} className="rounded-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save clinic profile"}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
