/**
 * Sync worker for Business unit definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class BusinessUnitsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'business_units';
  readonly stEndpointPath = 'https://api.servicetitan.io/settings/v2/tenant/3222348440/business-units';
  readonly rawTable = 'raw.st_business_units';
  readonly masterTable = 'master.business_units';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        account_code,
        acknowledgement_paragraph,
        active,
        address,
        authorization_paragraph,
        concept_code,
        corporate_contract_number,
        created_on,
        currency,
        default_tax_rate,
        division,
        email,
        external_data,
        franchise_id,
        invoice_header,
        invoice_message,
        material_sku,
        modified_on,
        name,
        official_name,
        phone_number,
        quickbooks_class,
        tag_type_ids,
        tenant,
        trade,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'accountCode' as account_code,
        payload->>'acknowledgementParagraph' as acknowledgement_paragraph,
        (payload->>'active')::boolean as active,
        payload->'address' as address,
        payload->>'authorizationParagraph' as authorization_paragraph,
        payload->>'conceptCode' as concept_code,
        payload->>'corporateContractNumber' as corporate_contract_number,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'currency' as currency,
        (payload->>'defaultTaxRate')::numeric as default_tax_rate,
        payload->'division' as division,
        payload->>'email' as email,
        payload->>'externalData' as external_data,
        payload->>'franchiseId' as franchise_id,
        payload->>'invoiceHeader' as invoice_header,
        payload->>'invoiceMessage' as invoice_message,
        payload->>'materialSku' as material_sku,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->>'officialName' as official_name,
        payload->>'phoneNumber' as phone_number,
        payload->>'quickbooksClass' as quickbooks_class,
        payload->'tagTypeIds' as tag_type_ids,
        payload->'tenant' as tenant,
        payload->'trade' as trade,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        account_code = EXCLUDED.account_code,
        acknowledgement_paragraph = EXCLUDED.acknowledgement_paragraph,
        active = EXCLUDED.active,
        address = EXCLUDED.address,
        authorization_paragraph = EXCLUDED.authorization_paragraph,
        concept_code = EXCLUDED.concept_code,
        corporate_contract_number = EXCLUDED.corporate_contract_number,
        created_on = EXCLUDED.created_on,
        currency = EXCLUDED.currency,
        default_tax_rate = EXCLUDED.default_tax_rate,
        division = EXCLUDED.division,
        email = EXCLUDED.email,
        external_data = EXCLUDED.external_data,
        franchise_id = EXCLUDED.franchise_id,
        invoice_header = EXCLUDED.invoice_header,
        invoice_message = EXCLUDED.invoice_message,
        material_sku = EXCLUDED.material_sku,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        official_name = EXCLUDED.official_name,
        phone_number = EXCLUDED.phone_number,
        quickbooks_class = EXCLUDED.quickbooks_class,
        tag_type_ids = EXCLUDED.tag_type_ids,
        tenant = EXCLUDED.tenant,
        trade = EXCLUDED.trade,
        synced_at = NOW(),
        sync_batch_id = EXCLUDED.sync_batch_id,
        payload_hash = EXCLUDED.payload_hash
      RETURNING (xmax = 0) as is_insert
    `, [batchId]);

    const inserted = result.rows.filter(r => r.is_insert).length;
    const updated = result.rows.filter(r => !r.is_insert).length;

    return { inserted, updated };
  }
}
