export type AuditLogRow = {
  id: string;
  entity: string;
  entity_id: string;
  action: string;
  old_data: string | null;
  new_data: string | null;
  created_at: string;
};
