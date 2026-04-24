import { supabase } from "./supabase";

/**
 * Loads committee rows for a committee_type and maps DB columns to UI fields.
 */
export async function fetchCommitteeByType(typeName) {
  const { data, error } = await supabase.from("committee").select("*").order("id");
  if (error) throw error;
  const t = typeName.trim().toLowerCase();
  return (data ?? [])
    .filter((m) => m.committee_type?.trim().toLowerCase() === t)
    .map((m) => ({
      ...m,
      designation: m.role,
      affiliation: m.organization,
    }));
}
