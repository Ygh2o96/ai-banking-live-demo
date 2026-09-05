window.SEED_LAB_DATA = {
  "comparison": {
    "classification": "SYNTHETIC_TRAINING_ONLY",
    "combination_policy": "Compare or combine model outputs only with explicit Banker judgment; no automatic blend is produced.",
    "path_a": {
      "flow": [
        "raw financial inputs",
        "normalization/mapping",
        "SSOT",
        "derive scaffold from zero",
        "fresh XLSX"
      ],
      "label": "No seed — preserved proof",
      "status": "EXISTING_SEPARATELY_REVIEWED_SURFACE_UNCHANGED",
      "surface": "../from0_model_build_v1/review_surface_v4"
    },
    "path_b": {
      "flow": [
        "business evidence",
        "source-ranked concepts",
        "SSOT values",
        "seed skeleton",
        "driver model"
      ],
      "label": "With seeds — this lab",
      "models": [
        {
          "blocked_entities": 0,
          "instantiable_entities": 2,
          "model_identity_sha256": "eb219ee51c8571f7e153e4571e07fee8f6e337ee05638207b057bfc5c4b3bb6c",
          "question": "How much project revenue, cost, gross profit and working-capital exposure follows from approved progress evidence?",
          "seed_id": "project_progress",
          "visible_control_count": 5
        },
        {
          "blocked_entities": 0,
          "instantiable_entities": 1,
          "model_identity_sha256": "82b30e43033758c60446106bb987f0a5084a4989efe63565a7e25fa76d5eb936",
          "question": "How much signed commercial work remains, how did it move, and what visibility sits outside secured backlog?",
          "seed_id": "backlog_conversion",
          "visible_control_count": 5
        },
        {
          "blocked_entities": 1,
          "instantiable_entities": 4,
          "model_identity_sha256": "49090e3f274b4876fd29a79b407d1fe49d92ea8641ab6f962ce3a12f58d799c7",
          "question": "What revenue and gross profit follow from monthly product quantity, price, channel, geography, FX and unit cost?",
          "seed_id": "volume_asp_channel",
          "visible_control_count": 6
        }
      ]
    },
    "schema": "seed-comparison/v1",
    "truth_boundary": "A seed can accelerate construction and make controls explicit. It cannot authorize a missing, conflicted or unconfirmed fact."
  },
  "concept_pack": {
    "attestation": "Fully synthetic anonymous composite; reusable structure only.",
    "classification": "SYNTHETIC_TRAINING_ONLY",
    "composite_case": true,
    "concepts": [
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand_ex_tax",
            "value": 300
          }
        ],
        "concept_id": "CON-1F2FC9F714A6",
        "concept_key": "backlog.approved_variations",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand_ex_tax",
          "value": 300
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Signed project contracts, non-binding framework arrangements and negotiation-stage opportunities are tracked separately and are not interchangeable.",
            "reference": "BCH-4.2",
            "requires_confirmation": true,
            "source_document_id": "SYN-BCH-001",
            "source_file": "business_chapter.json",
            "source_rank": 2,
            "source_type": "business_chapter",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-01C818844B59",
        "concept_key": "backlog.classification_policy_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Signed project contracts, non-binding framework arrangements and negotiation-stage opportunities are tracked separately and are not interchangeable.",
          "reference": "BCH-4.2",
          "requires_confirmation": true,
          "source_document_id": "SYN-BCH-001",
          "source_file": "business_chapter.json",
          "source_rank": 2,
          "source_type": "business_chapter",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "projects",
            "value": 1
          }
        ],
        "concept_id": "CON-756F9596BD75",
        "concept_key": "backlog.completed_count",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "projects",
          "value": 1
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "low",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-H2",
            "quote": "A framework opportunity is considered commercially promising, but no formal project contract has been signed and it is not secured backlog.",
            "reference": "MGT-2.1",
            "requires_confirmation": true,
            "source_document_id": "SYN-MGT-001",
            "source_file": "management_discussion.json",
            "source_rank": 3,
            "source_type": "management_discussion",
            "unit": "ratio",
            "value": 0.6
          }
        ],
        "concept_id": "CON-17D8070016FE",
        "concept_key": "backlog.framework_scenario_probability",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "low",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-H2",
          "quote": "A framework opportunity is considered commercially promising, but no formal project contract has been signed and it is not secured backlog.",
          "reference": "MGT-2.1",
          "requires_confirmation": true,
          "source_document_id": "SYN-MGT-001",
          "source_file": "management_discussion.json",
          "source_rank": 3,
          "source_type": "management_discussion",
          "unit": "ratio",
          "value": 0.6
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": "framework_only",
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-H2",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand_ex_tax",
            "value": 9000
          }
        ],
        "concept_id": "CON-867381571897",
        "concept_key": "backlog.framework_value",
        "has_conflict": false,
        "selected": {
          "classification": "framework_only",
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-H2",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand_ex_tax",
          "value": 9000
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "projects",
            "value": 1
          }
        ],
        "concept_id": "CON-E9B98E052F29",
        "concept_key": "backlog.loss_making_project_count",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "projects",
          "value": 1
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": "negotiation_stage",
            "confidence": "medium",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-H2",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand_ex_tax",
            "value": 4000
          }
        ],
        "concept_id": "CON-4BD387107A86",
        "concept_key": "backlog.negotiation_pipeline_value",
        "has_conflict": false,
        "selected": {
          "classification": "negotiation_stage",
          "confidence": "medium",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-H2",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand_ex_tax",
          "value": 4000
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "projects",
            "value": 3
          }
        ],
        "concept_id": "CON-075795958944",
        "concept_key": "backlog.opening_count",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "projects",
          "value": 3
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand_ex_tax",
            "value": 12000
          }
        ],
        "concept_id": "CON-25936A4064D4",
        "concept_key": "backlog.opening_value",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand_ex_tax",
          "value": 12000
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand_ex_tax",
            "value": 4200
          }
        ],
        "concept_id": "CON-1142593083AD",
        "concept_key": "backlog.revenue_recognized",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand_ex_tax",
          "value": 4200
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "projects",
            "value": 2
          }
        ],
        "concept_id": "CON-C501F14CC100",
        "concept_key": "backlog.signed_additions_count",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "projects",
          "value": 2
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand_ex_tax",
            "value": 5000
          }
        ],
        "concept_id": "CON-8964219A5A6B",
        "concept_key": "backlog.signed_additions_value",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand_ex_tax",
          "value": 5000
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "projects",
            "value": 0
          }
        ],
        "concept_id": "CON-17368D115D25",
        "concept_key": "backlog.terminated_count",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "projects",
          "value": 0
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand_ex_tax",
            "value": 0
          }
        ],
        "concept_id": "CON-FDA1097C7B6A",
        "concept_key": "backlog.terminated_value",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand_ex_tax",
          "value": 0
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-H1",
            "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
            "reference": "OPS-BACKLOG-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.38
          }
        ],
        "concept_id": "CON-83DAEA8D5E8D",
        "concept_key": "backlog.top_customer_concentration",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-H1",
          "quote": "Synthetic signed-backlog roll-forward and separately classified commercial visibility.",
          "reference": "OPS-BACKLOG-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.38
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "current",
            "quote": "The training composite has two operating engines: contracted project solutions and equipment sold by model, region and channel.",
            "reference": "BCH-2.1",
            "requires_confirmation": false,
            "source_document_id": "SYN-BCH-001",
            "source_file": "business_chapter.json",
            "source_rank": 2,
            "source_type": "business_chapter",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-7C75FA9EF3BF",
        "concept_key": "business.has_product_distribution",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "current",
          "quote": "The training composite has two operating engines: contracted project solutions and equipment sold by model, region and channel.",
          "reference": "BCH-2.1",
          "requires_confirmation": false,
          "source_document_id": "SYN-BCH-001",
          "source_file": "business_chapter.json",
          "source_rank": 2,
          "source_type": "business_chapter",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "current",
            "quote": "The training composite has two operating engines: contracted project solutions and equipment sold by model, region and channel.",
            "reference": "BCH-2.1",
            "requires_confirmation": false,
            "source_document_id": "SYN-BCH-001",
            "source_file": "business_chapter.json",
            "source_rank": 2,
            "source_type": "business_chapter",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-18979B71307D",
        "concept_key": "business.has_project_solutions",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "current",
          "quote": "The training composite has two operating engines: contracted project solutions and equipment sold by model, region and channel.",
          "reference": "BCH-2.1",
          "requires_confirmation": false,
          "source_document_id": "SYN-BCH-001",
          "source_file": "business_chapter.json",
          "source_rank": 2,
          "source_type": "business_chapter",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "days",
            "value": 40
          },
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026",
            "quote": "Online customer settlement is described as 45 days, while the operating schedule records 40 days.",
            "reference": "MGT-4.1",
            "requires_confirmation": true,
            "source_document_id": "SYN-MGT-001",
            "source_file": "management_discussion.json",
            "source_rank": 3,
            "source_type": "management_discussion",
            "unit": "days",
            "value": 45
          }
        ],
        "concept_id": "CON-ECFA37DD8473",
        "concept_key": "business.online_payment_days",
        "has_conflict": true,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "days",
          "value": 40
        },
        "state": "BOUND_WITH_CONFLICT"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026",
            "quote": "Freight, accessories, brand materials and service income are visible bridges rather than hidden plugs in product revenue.",
            "reference": "BCH-5.6",
            "requires_confirmation": false,
            "source_document_id": "SYN-BCH-001",
            "source_file": "business_chapter.json",
            "source_rank": 2,
            "source_type": "business_chapter",
            "unit": "method",
            "value": "explicit_ratios"
          }
        ],
        "concept_id": "CON-9F1C7EE81490",
        "concept_key": "business.product_addon_policy",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026",
          "quote": "Freight, accessories, brand materials and service income are visible bridges rather than hidden plugs in product revenue.",
          "reference": "BCH-5.6",
          "requires_confirmation": false,
          "source_document_id": "SYN-BCH-001",
          "source_file": "business_chapter.json",
          "source_rank": 2,
          "source_type": "business_chapter",
          "unit": "method",
          "value": "explicit_ratios"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026",
            "quote": "Equipment revenue is planned monthly from model quantity and net selling price, then rolled up through region and online or offline channel.",
            "reference": "BCH-5.3",
            "requires_confirmation": false,
            "source_document_id": "SYN-BCH-001",
            "source_file": "business_chapter.json",
            "source_rank": 2,
            "source_type": "business_chapter",
            "unit": "method",
            "value": "quantity_x_net_asp"
          }
        ],
        "concept_id": "CON-DD57D1FE005B",
        "concept_key": "business.product_driver_method",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026",
          "quote": "Equipment revenue is planned monthly from model quantity and net selling price, then rolled up through region and online or offline channel.",
          "reference": "BCH-5.3",
          "requires_confirmation": false,
          "source_document_id": "SYN-BCH-001",
          "source_file": "business_chapter.json",
          "source_rank": 2,
          "source_type": "business_chapter",
          "unit": "method",
          "value": "quantity_x_net_asp"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.015
          }
        ],
        "concept_id": "CON-7DEAB09B96AF",
        "concept_key": "product.ROW-01.accessories_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.015
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 1200
          }
        ],
        "concept_id": "CON-AF39650B9414",
        "concept_key": "product.ROW-01.asp_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 1200
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.005
          }
        ],
        "concept_id": "CON-61D6E4E888CB",
        "concept_key": "product.ROW-01.brand_material_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.005
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-90A18F75CB8E",
        "concept_key": "product.ROW-01.capacity_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "channel",
            "value": "online"
          }
        ],
        "concept_id": "CON-F0EE6469E7AD",
        "concept_key": "product.ROW-01.channel",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "channel",
          "value": "online"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-0D1DB651C702",
        "concept_key": "product.ROW-01.channel_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.08
          }
        ],
        "concept_id": "CON-013C6D1995B5",
        "concept_key": "product.ROW-01.discount_rate",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.08
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.02
          }
        ],
        "concept_id": "CON-9F15F989901A",
        "concept_key": "product.ROW-01.freight_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.02
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "RC_per_LC",
            "value": 0.85
          }
        ],
        "concept_id": "CON-147E6B571333",
        "concept_key": "product.ROW-01.fx_to_reporting",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "RC_per_LC",
          "value": 0.85
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "model",
            "value": "MODEL-ALPHA"
          }
        ],
        "concept_id": "CON-702CDD671F26",
        "concept_key": "product.ROW-01.model",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "model",
          "value": "MODEL-ALPHA"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-3FB16913EAED",
        "concept_key": "product.ROW-01.model_mapping_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "month",
            "value": "2026-07"
          }
        ],
        "concept_id": "CON-8C1583F49747",
        "concept_key": "product.ROW-01.month",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "month",
          "value": "2026-07"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": false
          }
        ],
        "concept_id": "CON-A7FC79C09D85",
        "concept_key": "product.ROW-01.new_product_flag",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": false
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "units",
            "value": 1000
          }
        ],
        "concept_id": "CON-C760D74AC799",
        "concept_key": "product.ROW-01.quantity",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "units",
          "value": 1000
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "region",
            "value": "REGION-NORTH"
          }
        ],
        "concept_id": "CON-477D3B630257",
        "concept_key": "product.ROW-01.region",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "region",
          "value": "REGION-NORTH"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "line",
            "value": "LINE-CORE"
          }
        ],
        "concept_id": "CON-F85ECE3164C6",
        "concept_key": "product.ROW-01.reporting_line",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "line",
          "value": "LINE-CORE"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.01
          }
        ],
        "concept_id": "CON-50E79142DFD3",
        "concept_key": "product.ROW-01.service_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.01
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 720
          }
        ],
        "concept_id": "CON-0D7FCB530E93",
        "concept_key": "product.ROW-01.unit_cost_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 720
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.02
          }
        ],
        "concept_id": "CON-2055F7DDB68F",
        "concept_key": "product.ROW-02.accessories_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.02
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 1600
          }
        ],
        "concept_id": "CON-16FBC2880789",
        "concept_key": "product.ROW-02.asp_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 1600
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.006
          }
        ],
        "concept_id": "CON-7803A2D07B37",
        "concept_key": "product.ROW-02.brand_material_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.006
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-D2A7E716B89F",
        "concept_key": "product.ROW-02.capacity_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "channel",
            "value": "offline"
          }
        ],
        "concept_id": "CON-3DF27FD62DAF",
        "concept_key": "product.ROW-02.channel",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "channel",
          "value": "offline"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-3FA1BF20B872",
        "concept_key": "product.ROW-02.channel_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.12
          }
        ],
        "concept_id": "CON-9211F446662A",
        "concept_key": "product.ROW-02.discount_rate",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.12
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.025
          }
        ],
        "concept_id": "CON-4B805A4DB9FA",
        "concept_key": "product.ROW-02.freight_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.025
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "RC_per_LC",
            "value": 0.85
          }
        ],
        "concept_id": "CON-3F09A399B219",
        "concept_key": "product.ROW-02.fx_to_reporting",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "RC_per_LC",
          "value": 0.85
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "model",
            "value": "MODEL-BETA"
          }
        ],
        "concept_id": "CON-3C497E795E49",
        "concept_key": "product.ROW-02.model",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "model",
          "value": "MODEL-BETA"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-2E94484A8D6E",
        "concept_key": "product.ROW-02.model_mapping_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "month",
            "value": "2026-07"
          }
        ],
        "concept_id": "CON-5AB5FE6496E3",
        "concept_key": "product.ROW-02.month",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "month",
          "value": "2026-07"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": false
          }
        ],
        "concept_id": "CON-6C3D1F09B803",
        "concept_key": "product.ROW-02.new_product_flag",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": false
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "units",
            "value": 700
          }
        ],
        "concept_id": "CON-90C875342C8D",
        "concept_key": "product.ROW-02.quantity",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "units",
          "value": 700
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "region",
            "value": "REGION-SOUTH"
          }
        ],
        "concept_id": "CON-6F87822527E6",
        "concept_key": "product.ROW-02.region",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "region",
          "value": "REGION-SOUTH"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "line",
            "value": "LINE-PLUS"
          }
        ],
        "concept_id": "CON-1493D99070AE",
        "concept_key": "product.ROW-02.reporting_line",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "line",
          "value": "LINE-PLUS"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.012
          }
        ],
        "concept_id": "CON-1D21E13155AC",
        "concept_key": "product.ROW-02.service_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.012
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-07",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 980
          }
        ],
        "concept_id": "CON-384BABBBDA87",
        "concept_key": "product.ROW-02.unit_cost_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-07",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 980
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.015
          }
        ],
        "concept_id": "CON-3B81919EABE3",
        "concept_key": "product.ROW-03.accessories_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.015
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 1180
          }
        ],
        "concept_id": "CON-DECC089E7427",
        "concept_key": "product.ROW-03.asp_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 1180
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.005
          }
        ],
        "concept_id": "CON-2410CC6097E5",
        "concept_key": "product.ROW-03.brand_material_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.005
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-A46A28A22526",
        "concept_key": "product.ROW-03.capacity_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "channel",
            "value": "offline"
          }
        ],
        "concept_id": "CON-667DCEB74B80",
        "concept_key": "product.ROW-03.channel",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "channel",
          "value": "offline"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-21743B3B73E7",
        "concept_key": "product.ROW-03.channel_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.09
          }
        ],
        "concept_id": "CON-AEC4FE9DB782",
        "concept_key": "product.ROW-03.discount_rate",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.09
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.02
          }
        ],
        "concept_id": "CON-0546C534EA57",
        "concept_key": "product.ROW-03.freight_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.02
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "RC_per_LC",
            "value": 0.86
          }
        ],
        "concept_id": "CON-A5D6B519A798",
        "concept_key": "product.ROW-03.fx_to_reporting",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "RC_per_LC",
          "value": 0.86
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "model",
            "value": "MODEL-ALPHA"
          }
        ],
        "concept_id": "CON-2FB76EE37AA6",
        "concept_key": "product.ROW-03.model",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "model",
          "value": "MODEL-ALPHA"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-54236BD7BD75",
        "concept_key": "product.ROW-03.model_mapping_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "month",
            "value": "2026-08"
          }
        ],
        "concept_id": "CON-4D07536B4BD2",
        "concept_key": "product.ROW-03.month",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "month",
          "value": "2026-08"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": false
          }
        ],
        "concept_id": "CON-3B6C027B7E4B",
        "concept_key": "product.ROW-03.new_product_flag",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": false
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "units",
            "value": 900
          }
        ],
        "concept_id": "CON-529F716A9133",
        "concept_key": "product.ROW-03.quantity",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "units",
          "value": 900
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "region",
            "value": "REGION-NORTH"
          }
        ],
        "concept_id": "CON-0A411CB104B7",
        "concept_key": "product.ROW-03.region",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "region",
          "value": "REGION-NORTH"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "line",
            "value": "LINE-CORE"
          }
        ],
        "concept_id": "CON-A56EA6873B68",
        "concept_key": "product.ROW-03.reporting_line",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "line",
          "value": "LINE-CORE"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.01
          }
        ],
        "concept_id": "CON-68CB13831EB2",
        "concept_key": "product.ROW-03.service_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.01
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 710
          }
        ],
        "concept_id": "CON-6AD9095CEBA9",
        "concept_key": "product.ROW-03.unit_cost_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 710
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.02
          }
        ],
        "concept_id": "CON-F05F294F85AA",
        "concept_key": "product.ROW-04.accessories_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.02
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 1580
          }
        ],
        "concept_id": "CON-023168D95D9F",
        "concept_key": "product.ROW-04.asp_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 1580
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.006
          }
        ],
        "concept_id": "CON-7CA3D8D08544",
        "concept_key": "product.ROW-04.brand_material_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.006
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-EAEC8918152B",
        "concept_key": "product.ROW-04.capacity_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "channel",
            "value": "online"
          }
        ],
        "concept_id": "CON-BA177ED461C5",
        "concept_key": "product.ROW-04.channel",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "channel",
          "value": "online"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-223ACAD2B2A3",
        "concept_key": "product.ROW-04.channel_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.11
          }
        ],
        "concept_id": "CON-E43CDC679DA7",
        "concept_key": "product.ROW-04.discount_rate",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.11
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.025
          }
        ],
        "concept_id": "CON-91AF3108CA9A",
        "concept_key": "product.ROW-04.freight_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.025
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "RC_per_LC",
            "value": 0.86
          }
        ],
        "concept_id": "CON-664FE917924E",
        "concept_key": "product.ROW-04.fx_to_reporting",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "RC_per_LC",
          "value": 0.86
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "model",
            "value": "MODEL-BETA"
          }
        ],
        "concept_id": "CON-10691BB70C1D",
        "concept_key": "product.ROW-04.model",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "model",
          "value": "MODEL-BETA"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-83753D8BF64E",
        "concept_key": "product.ROW-04.model_mapping_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "month",
            "value": "2026-08"
          }
        ],
        "concept_id": "CON-B6DAAA11C765",
        "concept_key": "product.ROW-04.month",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "month",
          "value": "2026-08"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": false
          }
        ],
        "concept_id": "CON-770292A21395",
        "concept_key": "product.ROW-04.new_product_flag",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": false
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "units",
            "value": 650
          }
        ],
        "concept_id": "CON-415534070EB7",
        "concept_key": "product.ROW-04.quantity",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "units",
          "value": 650
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "region",
            "value": "REGION-SOUTH"
          }
        ],
        "concept_id": "CON-603ABD28222F",
        "concept_key": "product.ROW-04.region",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "region",
          "value": "REGION-SOUTH"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "line",
            "value": "LINE-PLUS"
          }
        ],
        "concept_id": "CON-403149D864C7",
        "concept_key": "product.ROW-04.reporting_line",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "line",
          "value": "LINE-PLUS"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.012
          }
        ],
        "concept_id": "CON-358D214F742F",
        "concept_key": "product.ROW-04.service_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.012
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 970
          }
        ],
        "concept_id": "CON-EF3144006DC5",
        "concept_key": "product.ROW-04.unit_cost_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 970
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.015
          }
        ],
        "concept_id": "CON-21EECB595510",
        "concept_key": "product.ROW-NP1.accessories_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.015
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "low",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 1900
          }
        ],
        "concept_id": "CON-FE827E4C3298",
        "concept_key": "product.ROW-NP1.asp_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "low",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 1900
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.005
          }
        ],
        "concept_id": "CON-C3619A86BC14",
        "concept_key": "product.ROW-NP1.brand_material_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.005
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": false
          },
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "A new product launch is planned for the second forecast month, but production capacity and channel orders are not yet confirmed.",
            "reference": "MGT-3.2",
            "requires_confirmation": true,
            "source_document_id": "SYN-MGT-001",
            "source_file": "management_discussion.json",
            "source_rank": 3,
            "source_type": "management_discussion",
            "unit": "boolean",
            "value": false
          }
        ],
        "concept_id": "CON-661BB0A0A5B9",
        "concept_key": "product.ROW-NP1.capacity_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": false
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "channel",
            "value": "online"
          }
        ],
        "concept_id": "CON-D686F032A14E",
        "concept_key": "product.ROW-NP1.channel",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "channel",
          "value": "online"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": false
          },
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "A new product launch is planned for the second forecast month, but production capacity and channel orders are not yet confirmed.",
            "reference": "MGT-3.2",
            "requires_confirmation": true,
            "source_document_id": "SYN-MGT-001",
            "source_file": "management_discussion.json",
            "source_rank": 3,
            "source_type": "management_discussion",
            "unit": "boolean",
            "value": false
          }
        ],
        "concept_id": "CON-A5CFF26E880A",
        "concept_key": "product.ROW-NP1.channel_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": false
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "low",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.1
          }
        ],
        "concept_id": "CON-F9DA0BC301B5",
        "concept_key": "product.ROW-NP1.discount_rate",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "low",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.1
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.02
          }
        ],
        "concept_id": "CON-E1F9FE674348",
        "concept_key": "product.ROW-NP1.freight_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.02
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "RC_per_LC",
            "value": 0.86
          }
        ],
        "concept_id": "CON-688FBF1ACF43",
        "concept_key": "product.ROW-NP1.fx_to_reporting",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "RC_per_LC",
          "value": 0.86
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "model",
            "value": "MODEL-GAMMA"
          }
        ],
        "concept_id": "CON-755956ECD243",
        "concept_key": "product.ROW-NP1.model",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "model",
          "value": "MODEL-GAMMA"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": false
          }
        ],
        "concept_id": "CON-8739728AC867",
        "concept_key": "product.ROW-NP1.model_mapping_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": false
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "month",
            "value": "2026-08"
          }
        ],
        "concept_id": "CON-1F93B468DD31",
        "concept_key": "product.ROW-NP1.month",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "month",
          "value": "2026-08"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-ED0D0E5D5819",
        "concept_key": "product.ROW-NP1.new_product_flag",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "low",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "units",
            "value": 500
          }
        ],
        "concept_id": "CON-163BAA3251A5",
        "concept_key": "product.ROW-NP1.quantity",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "low",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "units",
          "value": 500
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "region",
            "value": "REGION-NORTH"
          }
        ],
        "concept_id": "CON-87AA31C5DD6C",
        "concept_key": "product.ROW-NP1.region",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "region",
          "value": "REGION-NORTH"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "line",
            "value": "LINE-NEW"
          }
        ],
        "concept_id": "CON-64E537A1724C",
        "concept_key": "product.ROW-NP1.reporting_line",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "line",
          "value": "LINE-NEW"
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.01
          }
        ],
        "concept_id": "CON-29B80F71657A",
        "concept_key": "product.ROW-NP1.service_ratio",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "medium",
          "confirmation_owner": "banker",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.01
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": false,
        "candidates": [
          {
            "classification": null,
            "confidence": "low",
            "confirmation_owner": "accountant",
            "confirmed": false,
            "period": "2026-08",
            "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
            "reference": "OPS-PRODUCT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "LC_per_unit",
            "value": 1250
          }
        ],
        "concept_id": "CON-E09FE601D168",
        "concept_key": "product.ROW-NP1.unit_cost_local",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "low",
          "confirmation_owner": "accountant",
          "confirmed": false,
          "period": "2026-08",
          "quote": "Synthetic monthly product schedule with four confirmed rows and one unconfirmed new-product ramp.",
          "reference": "OPS-PRODUCT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "LC_per_unit",
          "value": 1250
        },
        "state": "BLOCKED_CONFIRMATION"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 4800
          }
        ],
        "concept_id": "CON-0DCE9781B52D",
        "concept_key": "project.PRJ-A1.cost_incurred_to_date",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 4800
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 5700
          }
        ],
        "concept_id": "CON-3ACCD1808C29",
        "concept_key": "project.PRJ-A1.cumulative_billings",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 5700
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 5200
          }
        ],
        "concept_id": "CON-3E0033D95928",
        "concept_key": "project.PRJ-A1.cumulative_cash_collected",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 5200
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.8
          },
          {
            "classification": null,
            "confidence": "medium",
            "confirmation_owner": "banker",
            "confirmed": false,
            "period": "2026-06",
            "quote": "Management expects the larger solution project to be further advanced than the operating schedule currently records; the difference remains open for confirmation.",
            "reference": "MGT-1.3",
            "requires_confirmation": true,
            "source_document_id": "SYN-MGT-001",
            "source_file": "management_discussion.json",
            "source_rank": 3,
            "source_type": "management_discussion",
            "unit": "ratio",
            "value": 0.85
          }
        ],
        "concept_id": "CON-A7DD004B4E4F",
        "concept_key": "project.PRJ-A1.cumulative_progress_reported",
        "has_conflict": true,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.8
        },
        "state": "BOUND_WITH_CONFLICT"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 6000
          }
        ],
        "concept_id": "CON-9F629A3F0569",
        "concept_key": "project.PRJ-A1.expected_total_cost",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 6000
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "version",
            "value": "ETC-2026-06-v2"
          }
        ],
        "concept_id": "CON-E79564E52433",
        "concept_key": "project.PRJ-A1.expected_total_cost_version",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "version",
          "value": "ETC-2026-06-v2"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "id",
            "value": "PRJ-A1"
          }
        ],
        "concept_id": "CON-A0DBF6F78790",
        "concept_key": "project.PRJ-A1.identity",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "id",
          "value": "PRJ-A1"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "status",
            "value": "installation_active"
          }
        ],
        "concept_id": "CON-57C3C2CAFD03",
        "concept_key": "project.PRJ-A1.milestone_status",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "status",
          "value": "installation_active"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-05",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 4500
          }
        ],
        "concept_id": "CON-807556E25187",
        "concept_key": "project.PRJ-A1.prior_cumulative_cost",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-05",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 4500
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-05",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 5400
          }
        ],
        "concept_id": "CON-657FCCB09F09",
        "concept_key": "project.PRJ-A1.prior_cumulative_revenue",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-05",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 5400
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-05",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 6250
          }
        ],
        "concept_id": "CON-23DD47DFA69C",
        "concept_key": "project.PRJ-A1.prior_expected_total_cost",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-05",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 6250
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Project revenue is measured over time using eligible cost incurred against the latest approved expected total cost; the policy must remain accountant-confirmed.",
            "reference": "BCH-3.4",
            "requires_confirmation": true,
            "source_document_id": "SYN-BCH-001",
            "source_file": "business_chapter.json",
            "source_rank": 2,
            "source_type": "business_chapter",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-FD8CAEB1425A",
        "concept_key": "project.PRJ-A1.revenue_policy_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Project revenue is measured over time using eligible cost incurred against the latest approved expected total cost; the policy must remain accountant-confirmed.",
          "reference": "BCH-3.4",
          "requires_confirmation": true,
          "source_document_id": "SYN-BCH-001",
          "source_file": "business_chapter.json",
          "source_rank": 2,
          "source_type": "business_chapter",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
            "reference": "OPS-PROJECT-01",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand_ex_tax",
            "value": 7500
          }
        ],
        "concept_id": "CON-1FF62E6489BF",
        "concept_key": "project.PRJ-A1.transaction_price",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-A1 cost-to-complete record.",
          "reference": "OPS-PROJECT-01",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand_ex_tax",
          "value": 7500
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 1980
          }
        ],
        "concept_id": "CON-DEA2CDF4F7E2",
        "concept_key": "project.PRJ-B2.cost_incurred_to_date",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 1980
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 1600
          }
        ],
        "concept_id": "CON-654970F49D2B",
        "concept_key": "project.PRJ-B2.cumulative_billings",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 1600
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 1250
          }
        ],
        "concept_id": "CON-DB53C7FAD67A",
        "concept_key": "project.PRJ-B2.cumulative_cash_collected",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 1250
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "ratio",
            "value": 0.6
          }
        ],
        "concept_id": "CON-0052F411218C",
        "concept_key": "project.PRJ-B2.cumulative_progress_reported",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "ratio",
          "value": 0.6
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 3300
          }
        ],
        "concept_id": "CON-7276694DC937",
        "concept_key": "project.PRJ-B2.expected_total_cost",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 3300
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "version",
            "value": "ETC-2026-06-v3"
          }
        ],
        "concept_id": "CON-733487016C3F",
        "concept_key": "project.PRJ-B2.expected_total_cost_version",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "version",
          "value": "ETC-2026-06-v3"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "id",
            "value": "PRJ-B2"
          }
        ],
        "concept_id": "CON-BED557E7AC3C",
        "concept_key": "project.PRJ-B2.identity",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "id",
          "value": "PRJ-B2"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "status",
            "value": "commissioning"
          }
        ],
        "concept_id": "CON-0E3A93538328",
        "concept_key": "project.PRJ-B2.milestone_status",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "status",
          "value": "commissioning"
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-05",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 1500
          }
        ],
        "concept_id": "CON-21538A6ECF8B",
        "concept_key": "project.PRJ-B2.prior_cumulative_cost",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-05",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 1500
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-05",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 1450
          }
        ],
        "concept_id": "CON-62113214727C",
        "concept_key": "project.PRJ-B2.prior_cumulative_revenue",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-05",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 1450
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": null,
            "confirmed": true,
            "period": "2026-05",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": false,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand",
            "value": 3100
          }
        ],
        "concept_id": "CON-2A921DDBD654",
        "concept_key": "project.PRJ-B2.prior_expected_total_cost",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": null,
          "confirmed": true,
          "period": "2026-05",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": false,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand",
          "value": 3100
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "accountant",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Project revenue is measured over time using eligible cost incurred against the latest approved expected total cost; the policy must remain accountant-confirmed.",
            "reference": "BCH-3.4",
            "requires_confirmation": true,
            "source_document_id": "SYN-BCH-001",
            "source_file": "business_chapter.json",
            "source_rank": 2,
            "source_type": "business_chapter",
            "unit": "boolean",
            "value": true
          }
        ],
        "concept_id": "CON-1134A523CD03",
        "concept_key": "project.PRJ-B2.revenue_policy_confirmed",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "accountant",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Project revenue is measured over time using eligible cost incurred against the latest approved expected total cost; the policy must remain accountant-confirmed.",
          "reference": "BCH-3.4",
          "requires_confirmation": true,
          "source_document_id": "SYN-BCH-001",
          "source_file": "business_chapter.json",
          "source_rank": 2,
          "source_type": "business_chapter",
          "unit": "boolean",
          "value": true
        },
        "state": "BOUND"
      },
      {
        "authorized_for_binding": true,
        "candidates": [
          {
            "classification": null,
            "confidence": "high",
            "confirmation_owner": "banker",
            "confirmed": true,
            "period": "2026-06",
            "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
            "reference": "OPS-PROJECT-02",
            "requires_confirmation": true,
            "source_document_id": "SYN-OPS-001",
            "source_file": "operating_schedule.json",
            "source_rank": 1,
            "source_type": "operating_schedule",
            "unit": "CU_thousand_ex_tax",
            "value": 3000
          }
        ],
        "concept_id": "CON-8A3EB46E8B4A",
        "concept_key": "project.PRJ-B2.transaction_price",
        "has_conflict": false,
        "selected": {
          "classification": null,
          "confidence": "high",
          "confirmation_owner": "banker",
          "confirmed": true,
          "period": "2026-06",
          "quote": "Synthetic project PRJ-B2 cost-to-complete record with an expected-loss signal.",
          "reference": "OPS-PROJECT-02",
          "requires_confirmation": true,
          "source_document_id": "SYN-OPS-001",
          "source_file": "operating_schedule.json",
          "source_rank": 1,
          "source_type": "operating_schedule",
          "unit": "CU_thousand_ex_tax",
          "value": 3000
        },
        "state": "BOUND"
      }
    ],
    "counts": {
      "blocked_confirmation": 13,
      "concepts": 136,
      "conflicts": 2
    },
    "display_statements": [
      {
        "document_id": "SYN-OPS-001",
        "reference": "OPS-BACKLOG-01",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "text": "在手已签约订单滚存变动表与分类管理的商业可见度。"
      },
      {
        "document_id": "SYN-BCH-001",
        "reference": "BCH-2.1",
        "source_rank": 2,
        "source_type": "business_chapter",
        "text": "公司拥有两大业务引擎：一是按合同履行的项目制解决方案，二是按型号、区域与渠道销售的设备产品。"
      },
      {
        "document_id": "SYN-BCH-001",
        "reference": "BCH-3.4",
        "source_rank": 2,
        "source_type": "business_chapter",
        "text": "项目制收入按履约进度确认，采用发生成本占最新审批预计总成本的比例（投入法）；该会计政策须经申报会计师核验确认。"
      },
      {
        "document_id": "SYN-BCH-001",
        "reference": "BCH-4.2",
        "source_rank": 2,
        "source_type": "business_chapter",
        "text": "正式签署的项目合同、无约束力框架协议与商务谈判阶段机会实行分账管理，三者不可混淆替代。"
      },
      {
        "document_id": "SYN-BCH-001",
        "reference": "BCH-5.3",
        "source_rank": 2,
        "source_type": "business_chapter",
        "text": "设备产品销售收入按月度计划编制，根据各型号销量与净售价测算，并按销售区域及线上/线下渠道逐级汇总。"
      },
      {
        "document_id": "SYN-MGT-001",
        "reference": "MGT-1.3",
        "source_rank": 3,
        "source_type": "management_discussion",
        "text": "管理层认为大型解决方案项目的实际进度高于运营统计表记录；该项差异保持公开并待进一步确认。"
      },
      {
        "document_id": "SYN-MGT-001",
        "reference": "MGT-2.1",
        "source_rank": 3,
        "source_type": "management_discussion",
        "text": "某框架合作机会虽具商业前景，但尚未签署正式项目合同，不得计入确定性在手订单。"
      },
      {
        "document_id": "SYN-MGT-001",
        "reference": "MGT-3.2",
        "source_rank": 3,
        "source_type": "management_discussion",
        "text": "计划于预测期第二个月推出新产品，但产能规划与渠道订单尚未完全落实。"
      }
    ],
    "schema": "source-ranked-concept-pack/v1",
    "source_rank_policy": {
      "1": "operating_schedule",
      "2": "business_chapter",
      "3": "management_discussion",
      "lower_number_is_stronger": true
    },
    "source_register": [
      {
        "document_id": "SYN-OPS-001",
        "file": "operating_schedule.json",
        "sha256": "fc5d7d928aecf24e7d2e74b323d7980f772ee0b7aba1574e0ef1ff42f6c1044a",
        "source_rank": 1,
        "source_type": "operating_schedule"
      },
      {
        "document_id": "SYN-BCH-001",
        "file": "business_chapter.json",
        "sha256": "6f0666ae040427fba69c78ec893ff64ca6d1867c38e8fd0b815836bc170ae4f1",
        "source_rank": 2,
        "source_type": "business_chapter"
      },
      {
        "document_id": "SYN-MGT-001",
        "file": "management_discussion.json",
        "sha256": "b4b0a18fc9ac343d26bec89a32d66c7371f5f0600f77bc5827f668a78ef71d3a",
        "source_rank": 3,
        "source_type": "management_discussion"
      }
    ]
  },
  "conflict_queue": {
    "classification": "SYNTHETIC_TRAINING_ONLY",
    "conflicts": [
      {
        "candidate_count": 2,
        "concept_id": "CON-ECFA37DD8473",
        "concept_key": "business.online_payment_days",
        "required_action": "Preserve the conflict; confirm the governing source before external reliance.",
        "selected_by_rank": {
          "reference": "OPS-PRODUCT-01",
          "source_document_id": "SYN-OPS-001",
          "unit": "days",
          "value": 40
        },
        "state": "OPEN_CONTRADICTION"
      },
      {
        "candidate_count": 2,
        "concept_id": "CON-A7DD004B4E4F",
        "concept_key": "project.PRJ-A1.cumulative_progress_reported",
        "required_action": "Preserve the conflict; confirm the governing source before external reliance.",
        "selected_by_rank": {
          "reference": "OPS-PROJECT-01",
          "source_document_id": "SYN-OPS-001",
          "unit": "ratio",
          "value": 0.8
        },
        "state": "OPEN_CONTRADICTION"
      }
    ],
    "open_count": 2,
    "schema": "concept-conflict-queue/v1"
  },
  "models": {
    "backlog_conversion": {
      "boundary": "Seed output is a calculated training artifact, not Banker judgment, accountant sign-off or external authorization.",
      "classification": "SYNTHETIC_TRAINING_ONLY",
      "controls": [
        {
          "control_id": "VALUE_RECONCILIATION",
          "detail": "Opening + signed additions ± approved variations − recognized/terminated work equals closing signed backlog.",
          "status": "PASS"
        },
        {
          "control_id": "COUNT_RECONCILIATION",
          "detail": "Opening + signed additions − completed/terminated projects equals closing count.",
          "status": "PASS"
        },
        {
          "control_id": "SIGNED_ONLY",
          "detail": "Framework-only and negotiation-stage visibility are excluded from secured backlog.",
          "status": "PASS"
        },
        {
          "control_id": "PROBABILITY_SCENARIO_AUTH",
          "detail": "Probability weighting remains outside the base and requires Banker confirmation.",
          "status": "BLOCKED"
        },
        {
          "control_id": "LOSS_AND_CONCENTRATION_VISIBILITY",
          "detail": "Loss-making project count and concentration remain visible alongside backlog.",
          "status": "FLAG"
        }
      ],
      "fit": {
        "entities": [
          {
            "blockers": [],
            "entity_id": "backlog",
            "instantiable": true,
            "mappings": [
              {
                "concept_key": "backlog.opening_value",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand_ex_tax",
                  "value": 12000
                },
                "required": true,
                "slot_id": "opening_value",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.opening_count",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "projects",
                  "value": 3
                },
                "required": true,
                "slot_id": "opening_count",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.signed_additions_value",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand_ex_tax",
                  "value": 5000
                },
                "required": true,
                "slot_id": "signed_additions_value",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.signed_additions_count",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "projects",
                  "value": 2
                },
                "required": true,
                "slot_id": "signed_additions_count",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.approved_variations",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand_ex_tax",
                  "value": 300
                },
                "required": true,
                "slot_id": "approved_variations",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.revenue_recognized",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand_ex_tax",
                  "value": 4200
                },
                "required": true,
                "slot_id": "revenue_recognized",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.terminated_value",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand_ex_tax",
                  "value": 0
                },
                "required": true,
                "slot_id": "terminated_value",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.completed_count",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "projects",
                  "value": 1
                },
                "required": true,
                "slot_id": "completed_count",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.terminated_count",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "projects",
                  "value": 0
                },
                "required": true,
                "slot_id": "terminated_count",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.classification_policy_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "BCH-4.2",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-BCH-001",
                  "source_rank": 2,
                  "source_type": "business_chapter",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "classification_policy_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.framework_value",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": "framework_only",
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H2",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand_ex_tax",
                  "value": 9000
                },
                "required": false,
                "slot_id": "framework_value",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.negotiation_pipeline_value",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": "negotiation_stage",
                  "confidence": "medium",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H2",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand_ex_tax",
                  "value": 4000
                },
                "required": false,
                "slot_id": "negotiation_pipeline_value",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.framework_scenario_probability",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "low",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-H2",
                  "reference": "MGT-2.1",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-MGT-001",
                  "source_rank": 3,
                  "source_type": "management_discussion",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "ratio",
                  "value": 0.6
                },
                "required": false,
                "slot_id": "framework_scenario_probability",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "backlog.loss_making_project_count",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "projects",
                  "value": 1
                },
                "required": false,
                "slot_id": "loss_making_project_count",
                "state": "BOUND"
              },
              {
                "concept_key": "backlog.top_customer_concentration",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-H1",
                  "reference": "OPS-BACKLOG-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.38
                },
                "required": false,
                "slot_id": "top_customer_concentration",
                "state": "BOUND"
              }
            ]
          }
        ],
        "schema": "seed-fit/v1",
        "seed_id": "backlog_conversion",
        "summary": {
          "blocked": 0,
          "conflicted_bindings": 0,
          "entities": 1,
          "instantiable": 1
        }
      },
      "formula_lineage": {
        "allowed_operators": [
          "add",
          "subtract"
        ],
        "nodes": [
          {
            "inputs": [
              "opening_value",
              "signed_additions_value"
            ],
            "node_id": "gross_signed_backlog",
            "operator": "add",
            "output_unit": "CU_thousand_ex_tax"
          },
          {
            "inputs": [
              "gross_signed_backlog",
              "approved_variations"
            ],
            "node_id": "post_variation_backlog",
            "operator": "add",
            "output_unit": "CU_thousand_ex_tax"
          },
          {
            "inputs": [
              "revenue_recognized",
              "terminated_value"
            ],
            "node_id": "value_reductions",
            "operator": "add",
            "output_unit": "CU_thousand_ex_tax"
          },
          {
            "inputs": [
              "post_variation_backlog",
              "value_reductions"
            ],
            "node_id": "closing_backlog_value",
            "operator": "subtract",
            "output_unit": "CU_thousand_ex_tax"
          },
          {
            "inputs": [
              "opening_count",
              "signed_additions_count"
            ],
            "node_id": "gross_project_count",
            "operator": "add",
            "output_unit": "projects"
          },
          {
            "inputs": [
              "completed_count",
              "terminated_count"
            ],
            "node_id": "count_reductions",
            "operator": "add",
            "output_unit": "projects"
          },
          {
            "inputs": [
              "gross_project_count",
              "count_reductions"
            ],
            "node_id": "closing_backlog_count",
            "operator": "subtract",
            "output_unit": "projects"
          }
        ]
      },
      "immutability_evidence": {
        "ssot_hash_after": "0ef15c802338a4a9452d51117336f5b56aea46c3aacbcc7ca6e2e3c2a5e13218",
        "ssot_hash_before": "0ef15c802338a4a9452d51117336f5b56aea46c3aacbcc7ca6e2e3c2a5e13218",
        "unchanged": true
      },
      "model": {
        "loss_making_project_count": 1,
        "question_answered": "How much signed commercial work remains, how did it move, and what visibility sits outside secured backlog?",
        "separate_visibility_buckets": {
          "framework_only": 9000,
          "included_in_signed_backlog": false,
          "negotiation_stage": 4000,
          "probability_scenario_status": "BLOCKED_UNCONFIRMED",
          "probability_weighted_scenario": null
        },
        "signed_roll_forward": {
          "closing_backlog_count": 4,
          "closing_backlog_value": 13100,
          "count_reductions": 1,
          "gross_project_count": 5,
          "gross_signed_backlog": 17000,
          "post_variation_backlog": 17300,
          "value_reductions": 4200
        },
        "state": "CALCULATED_WITH_SEPARATE_VISIBILITY",
        "timing_sensitivity": [
          {
            "closing_backlog_value": 13520,
            "revenue_shifted_out": 420,
            "scenario": "10% conversion delay",
            "status": "ILLUSTRATIVE_NOT_BASE"
          },
          {
            "closing_backlog_value": 14150,
            "revenue_shifted_out": 1050,
            "scenario": "25% conversion delay",
            "status": "ILLUSTRATIVE_NOT_BASE"
          }
        ],
        "top_customer_concentration": 0.38
      },
      "model_identity": {
        "concept_pack_sha256": "c4b4a4dc82da431b66f22eadb1aad2713a814f6e146fe7bf8f89165d5b329d58",
        "formula_dag_sha256": "f66be556cce3155042a09c24685128e830480b9af85ef152597064e002d29c42",
        "model_identity_sha256": "82b30e43033758c60446106bb987f0a5084a4989efe63565a7e25fa76d5eb936",
        "seed_id": "backlog_conversion",
        "seed_sha256": "2c17c9ea07d3ceb8e013f5eaf5059f1eed49b859c1ec21cd7eac46168218d573",
        "seed_version": "1.0.0",
        "ssot_sha256": "64cac5da38650d03ede91d74ca37b34337aaa49276ecdd00256e0b94ae168aa0"
      },
      "schema": "instantiated-driver-model/v1",
      "seed_id": "backlog_conversion",
      "seed_version": "1.0.0"
    },
    "project_progress": {
      "boundary": "Seed output is a calculated training artifact, not Banker judgment, accountant sign-off or external authorization.",
      "classification": "SYNTHETIC_TRAINING_ONLY",
      "controls": [
        {
          "control_id": "ETC_REVISION_CATCH_UP",
          "detail": "Latest approved expected total cost differs from the prior estimate; catch-up is shown through current-period revenue.",
          "entity_id": "PRJ-A1",
          "status": "FLAG"
        },
        {
          "control_id": "PROGRESS_RANGE",
          "detail": "Calculated progress is within 0%–100%; no clipping.",
          "entity_id": "PRJ-A1",
          "status": "PASS"
        },
        {
          "control_id": "ETC_REVISION_CATCH_UP",
          "detail": "Latest approved expected total cost differs from the prior estimate; catch-up is shown through current-period revenue.",
          "entity_id": "PRJ-B2",
          "status": "FLAG"
        },
        {
          "control_id": "EXPECTED_LOSS",
          "detail": "Expected total cost exceeds transaction price; the onerous/expected-loss treatment is not hidden.",
          "entity_id": "PRJ-B2",
          "status": "FLAG_ACCOUNTANT_CONFIRMATION_REQUIRED"
        },
        {
          "control_id": "PROGRESS_RANGE",
          "detail": "Calculated progress is within 0%–100%; no clipping.",
          "entity_id": "PRJ-B2",
          "status": "PASS"
        }
      ],
      "fit": {
        "entities": [
          {
            "blockers": [],
            "entity_id": "PRJ-A1",
            "instantiable": true,
            "mappings": [
              {
                "concept_key": "project.PRJ-A1.identity",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "id",
                  "value": "PRJ-A1"
                },
                "required": true,
                "slot_id": "identity",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.transaction_price",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand_ex_tax",
                  "value": 7500
                },
                "required": true,
                "slot_id": "transaction_price",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.cost_incurred_to_date",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 4800
                },
                "required": true,
                "slot_id": "cost_incurred_to_date",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.expected_total_cost",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 6000
                },
                "required": true,
                "slot_id": "expected_total_cost",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.expected_total_cost_version",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "version",
                  "value": "ETC-2026-06-v2"
                },
                "required": true,
                "slot_id": "expected_total_cost_version",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.prior_expected_total_cost",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-05",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 6250
                },
                "required": true,
                "slot_id": "prior_expected_total_cost",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.prior_cumulative_revenue",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-05",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 5400
                },
                "required": true,
                "slot_id": "prior_cumulative_revenue",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.prior_cumulative_cost",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-05",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 4500
                },
                "required": true,
                "slot_id": "prior_cumulative_cost",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.cumulative_billings",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 5700
                },
                "required": true,
                "slot_id": "cumulative_billings",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.cumulative_cash_collected",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 5200
                },
                "required": true,
                "slot_id": "cumulative_cash_collected",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.revenue_policy_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "BCH-3.4",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-BCH-001",
                  "source_rank": 2,
                  "source_type": "business_chapter",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "revenue_policy_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.milestone_status",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "status",
                  "value": "installation_active"
                },
                "required": true,
                "slot_id": "milestone_status",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-A1.cumulative_progress_reported",
                "reason": "Highest-ranked authorized value selected; contradiction remains visible.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": true,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND_WITH_CONFLICT",
                  "unit": "ratio",
                  "value": 0.8
                },
                "required": false,
                "slot_id": "cumulative_progress_reported",
                "state": "BOUND_WITH_CONFLICT"
              }
            ]
          },
          {
            "blockers": [],
            "entity_id": "PRJ-B2",
            "instantiable": true,
            "mappings": [
              {
                "concept_key": "project.PRJ-B2.identity",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "id",
                  "value": "PRJ-B2"
                },
                "required": true,
                "slot_id": "identity",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.transaction_price",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand_ex_tax",
                  "value": 3000
                },
                "required": true,
                "slot_id": "transaction_price",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.cost_incurred_to_date",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 1980
                },
                "required": true,
                "slot_id": "cost_incurred_to_date",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.expected_total_cost",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 3300
                },
                "required": true,
                "slot_id": "expected_total_cost",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.expected_total_cost_version",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "version",
                  "value": "ETC-2026-06-v3"
                },
                "required": true,
                "slot_id": "expected_total_cost_version",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.prior_expected_total_cost",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-05",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 3100
                },
                "required": true,
                "slot_id": "prior_expected_total_cost",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.prior_cumulative_revenue",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-05",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 1450
                },
                "required": true,
                "slot_id": "prior_cumulative_revenue",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.prior_cumulative_cost",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-05",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 1500
                },
                "required": true,
                "slot_id": "prior_cumulative_cost",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.cumulative_billings",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 1600
                },
                "required": true,
                "slot_id": "cumulative_billings",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.cumulative_cash_collected",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "CU_thousand",
                  "value": 1250
                },
                "required": true,
                "slot_id": "cumulative_cash_collected",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.revenue_policy_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "BCH-3.4",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-BCH-001",
                  "source_rank": 2,
                  "source_type": "business_chapter",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "revenue_policy_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.milestone_status",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "status",
                  "value": "commissioning"
                },
                "required": true,
                "slot_id": "milestone_status",
                "state": "BOUND"
              },
              {
                "concept_key": "project.PRJ-B2.cumulative_progress_reported",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-06",
                  "reference": "OPS-PROJECT-02",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.6
                },
                "required": false,
                "slot_id": "cumulative_progress_reported",
                "state": "BOUND"
              }
            ]
          }
        ],
        "schema": "seed-fit/v1",
        "seed_id": "project_progress",
        "summary": {
          "blocked": 0,
          "conflicted_bindings": 1,
          "entities": 2,
          "instantiable": 2
        }
      },
      "formula_lineage": {
        "allowed_operators": [
          "add",
          "subtract",
          "multiply",
          "divide",
          "max_zero"
        ],
        "nodes": [
          {
            "inputs": [
              "cost_incurred_to_date",
              "expected_total_cost"
            ],
            "node_id": "cumulative_progress",
            "operator": "divide",
            "output_unit": "ratio"
          },
          {
            "inputs": [
              "transaction_price",
              "cumulative_progress"
            ],
            "node_id": "cumulative_revenue",
            "operator": "multiply",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "cumulative_revenue",
              "prior_cumulative_revenue"
            ],
            "node_id": "current_period_revenue",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "cost_incurred_to_date",
              "prior_cumulative_cost"
            ],
            "node_id": "current_period_cost",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "current_period_revenue",
              "current_period_cost"
            ],
            "node_id": "project_gp",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "project_gp",
              "current_period_revenue"
            ],
            "node_id": "project_gp_margin",
            "operator": "divide",
            "output_unit": "ratio"
          },
          {
            "inputs": [
              "cumulative_billings",
              "cumulative_cash_collected"
            ],
            "node_id": "unconditional_receivable_raw",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "unconditional_receivable_raw"
            ],
            "node_id": "receivable",
            "operator": "max_zero",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "cumulative_revenue",
              "cumulative_billings"
            ],
            "node_id": "contract_asset_raw",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "contract_asset_raw"
            ],
            "node_id": "contract_asset",
            "operator": "max_zero",
            "output_unit": "CU_thousand"
          }
        ]
      },
      "immutability_evidence": {
        "ssot_hash_after": "0ef15c802338a4a9452d51117336f5b56aea46c3aacbcc7ca6e2e3c2a5e13218",
        "ssot_hash_before": "0ef15c802338a4a9452d51117336f5b56aea46c3aacbcc7ca6e2e3c2a5e13218",
        "unchanged": true
      },
      "model": {
        "blocked_entities": [],
        "period_aggregate": {
          "contract_asset": 500,
          "current_period_cost": 780,
          "current_period_revenue": 950,
          "project_gp": 170,
          "project_gp_margin": 0.178947,
          "receivable": 850
        },
        "project_rows": [
          {
            "bound_inputs": {
              "cost_incurred_to_date": 4800,
              "cumulative_billings": 5700,
              "cumulative_cash_collected": 5200,
              "cumulative_progress_reported": 0.8,
              "expected_total_cost": 6000,
              "expected_total_cost_version": "ETC-2026-06-v2",
              "identity": "PRJ-A1",
              "milestone_status": "installation_active",
              "prior_cumulative_cost": 4500,
              "prior_cumulative_revenue": 5400,
              "prior_expected_total_cost": 6250,
              "revenue_policy_confirmed": true,
              "transaction_price": 7500
            },
            "calculated": {
              "contract_asset": 300,
              "contract_asset_raw": 300,
              "cumulative_progress": 0.8,
              "cumulative_revenue": 6000,
              "current_period_cost": 300,
              "current_period_revenue": 600,
              "project_gp": 300,
              "project_gp_margin": 0.5,
              "receivable": 500,
              "unconditional_receivable_raw": 500
            },
            "dimensions": {
              "expected_total_cost_version": "ETC-2026-06-v2",
              "milestone_status": "installation_active"
            },
            "entity_id": "PRJ-A1",
            "estimate_revision_signal": true,
            "expected_loss_signal": false,
            "period": "2026-06",
            "state": "CALCULATED_WITH_VISIBLE_FLAGS"
          },
          {
            "bound_inputs": {
              "cost_incurred_to_date": 1980,
              "cumulative_billings": 1600,
              "cumulative_cash_collected": 1250,
              "cumulative_progress_reported": 0.6,
              "expected_total_cost": 3300,
              "expected_total_cost_version": "ETC-2026-06-v3",
              "identity": "PRJ-B2",
              "milestone_status": "commissioning",
              "prior_cumulative_cost": 1500,
              "prior_cumulative_revenue": 1450,
              "prior_expected_total_cost": 3100,
              "revenue_policy_confirmed": true,
              "transaction_price": 3000
            },
            "calculated": {
              "contract_asset": 200,
              "contract_asset_raw": 200,
              "cumulative_progress": 0.6,
              "cumulative_revenue": 1800,
              "current_period_cost": 480,
              "current_period_revenue": 350,
              "project_gp": -130,
              "project_gp_margin": -0.371429,
              "receivable": 350,
              "unconditional_receivable_raw": 350
            },
            "dimensions": {
              "expected_total_cost_version": "ETC-2026-06-v3",
              "milestone_status": "commissioning"
            },
            "entity_id": "PRJ-B2",
            "estimate_revision_signal": true,
            "expected_loss_signal": true,
            "period": "2026-06",
            "state": "CALCULATED_WITH_VISIBLE_FLAGS"
          }
        ],
        "question_answered": "How much project revenue, cost, gross profit and working-capital exposure follows from approved progress evidence?",
        "sensitivities": [
          {
            "current_period_revenue": 578.571429,
            "scenario": "ETC +5%",
            "status": "ILLUSTRATIVE_NOT_BASE"
          },
          {
            "current_period_revenue": 1360.526316,
            "scenario": "ETC -5%",
            "status": "ILLUSTRATIVE_NOT_BASE"
          }
        ]
      },
      "model_identity": {
        "concept_pack_sha256": "c4b4a4dc82da431b66f22eadb1aad2713a814f6e146fe7bf8f89165d5b329d58",
        "formula_dag_sha256": "9ed4465778b69a9108839022e5149b6301bf193878324d1bc4feae2cdf7a5f8e",
        "model_identity_sha256": "eb219ee51c8571f7e153e4571e07fee8f6e337ee05638207b057bfc5c4b3bb6c",
        "seed_id": "project_progress",
        "seed_sha256": "4e159ca662b3c798c9fe7a8e25bc369e02c6f47e3804f17fb73c75d81dcd3123",
        "seed_version": "1.0.0",
        "ssot_sha256": "64cac5da38650d03ede91d74ca37b34337aaa49276ecdd00256e0b94ae168aa0"
      },
      "schema": "instantiated-driver-model/v1",
      "seed_id": "project_progress",
      "seed_version": "1.0.0"
    },
    "volume_asp_channel": {
      "boundary": "Seed output is a calculated training artifact, not Banker judgment, accountant sign-off or external authorization.",
      "classification": "SYNTHETIC_TRAINING_ONLY",
      "controls": [
        {
          "control_id": "ROW_AUTHORIZATION",
          "detail": "Unit, FX, mapping, capacity and channel gates passed.",
          "entity_id": "ROW-01",
          "status": "PASS"
        },
        {
          "control_id": "ROW_AUTHORIZATION",
          "detail": "Unit, FX, mapping, capacity and channel gates passed.",
          "entity_id": "ROW-02",
          "status": "PASS"
        },
        {
          "control_id": "ROW_AUTHORIZATION",
          "detail": "Unit, FX, mapping, capacity and channel gates passed.",
          "entity_id": "ROW-03",
          "status": "PASS"
        },
        {
          "control_id": "ROW_AUTHORIZATION",
          "detail": "Unit, FX, mapping, capacity and channel gates passed.",
          "entity_id": "ROW-04",
          "status": "PASS"
        },
        {
          "control_id": "ROLLUP_RECONCILIATION",
          "detail": "Product rows reconcile through model, region/channel, month and group views.",
          "status": "PASS"
        },
        {
          "control_id": "NEW_PRODUCT_RAMP",
          "detail": "Unconfirmed new-product rows remain excluded from base outputs.",
          "status": "BLOCKED"
        }
      ],
      "fit": {
        "entities": [
          {
            "blockers": [],
            "entity_id": "ROW-01",
            "instantiable": true,
            "mappings": [
              {
                "concept_key": "product.ROW-01.model",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "model",
                  "value": "MODEL-ALPHA"
                },
                "required": true,
                "slot_id": "model",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.reporting_line",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "line",
                  "value": "LINE-CORE"
                },
                "required": true,
                "slot_id": "reporting_line",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.region",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "region",
                  "value": "REGION-NORTH"
                },
                "required": true,
                "slot_id": "region",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.channel",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "channel",
                  "value": "online"
                },
                "required": true,
                "slot_id": "channel",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.month",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "month",
                  "value": "2026-07"
                },
                "required": true,
                "slot_id": "month",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.quantity",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "units",
                  "value": 1000
                },
                "required": true,
                "slot_id": "quantity",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.asp_local",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "LC_per_unit",
                  "value": 1200
                },
                "required": true,
                "slot_id": "asp_local",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.fx_to_reporting",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "RC_per_LC",
                  "value": 0.85
                },
                "required": true,
                "slot_id": "fx_to_reporting",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.unit_cost_local",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "LC_per_unit",
                  "value": 720
                },
                "required": true,
                "slot_id": "unit_cost_local",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.discount_rate",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.08
                },
                "required": true,
                "slot_id": "discount_rate",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.freight_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.02
                },
                "required": true,
                "slot_id": "freight_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.accessories_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.015
                },
                "required": true,
                "slot_id": "accessories_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.brand_material_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.005
                },
                "required": true,
                "slot_id": "brand_material_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.service_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.01
                },
                "required": true,
                "slot_id": "service_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.model_mapping_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "model_mapping_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.capacity_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "capacity_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.channel_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "channel_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-01.new_product_flag",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": false
                },
                "required": true,
                "slot_id": "new_product_flag",
                "state": "BOUND"
              }
            ]
          },
          {
            "blockers": [],
            "entity_id": "ROW-02",
            "instantiable": true,
            "mappings": [
              {
                "concept_key": "product.ROW-02.model",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "model",
                  "value": "MODEL-BETA"
                },
                "required": true,
                "slot_id": "model",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.reporting_line",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "line",
                  "value": "LINE-PLUS"
                },
                "required": true,
                "slot_id": "reporting_line",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.region",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "region",
                  "value": "REGION-SOUTH"
                },
                "required": true,
                "slot_id": "region",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.channel",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "channel",
                  "value": "offline"
                },
                "required": true,
                "slot_id": "channel",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.month",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "month",
                  "value": "2026-07"
                },
                "required": true,
                "slot_id": "month",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.quantity",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "units",
                  "value": 700
                },
                "required": true,
                "slot_id": "quantity",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.asp_local",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "LC_per_unit",
                  "value": 1600
                },
                "required": true,
                "slot_id": "asp_local",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.fx_to_reporting",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "RC_per_LC",
                  "value": 0.85
                },
                "required": true,
                "slot_id": "fx_to_reporting",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.unit_cost_local",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "LC_per_unit",
                  "value": 980
                },
                "required": true,
                "slot_id": "unit_cost_local",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.discount_rate",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.12
                },
                "required": true,
                "slot_id": "discount_rate",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.freight_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.025
                },
                "required": true,
                "slot_id": "freight_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.accessories_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.02
                },
                "required": true,
                "slot_id": "accessories_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.brand_material_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.006
                },
                "required": true,
                "slot_id": "brand_material_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.service_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.012
                },
                "required": true,
                "slot_id": "service_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.model_mapping_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "model_mapping_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.capacity_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "capacity_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.channel_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "channel_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-02.new_product_flag",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-07",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": false
                },
                "required": true,
                "slot_id": "new_product_flag",
                "state": "BOUND"
              }
            ]
          },
          {
            "blockers": [],
            "entity_id": "ROW-03",
            "instantiable": true,
            "mappings": [
              {
                "concept_key": "product.ROW-03.model",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "model",
                  "value": "MODEL-ALPHA"
                },
                "required": true,
                "slot_id": "model",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.reporting_line",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "line",
                  "value": "LINE-CORE"
                },
                "required": true,
                "slot_id": "reporting_line",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.region",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "region",
                  "value": "REGION-NORTH"
                },
                "required": true,
                "slot_id": "region",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.channel",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "channel",
                  "value": "offline"
                },
                "required": true,
                "slot_id": "channel",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.month",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "month",
                  "value": "2026-08"
                },
                "required": true,
                "slot_id": "month",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.quantity",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "units",
                  "value": 900
                },
                "required": true,
                "slot_id": "quantity",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.asp_local",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "LC_per_unit",
                  "value": 1180
                },
                "required": true,
                "slot_id": "asp_local",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.fx_to_reporting",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "RC_per_LC",
                  "value": 0.86
                },
                "required": true,
                "slot_id": "fx_to_reporting",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.unit_cost_local",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "LC_per_unit",
                  "value": 710
                },
                "required": true,
                "slot_id": "unit_cost_local",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.discount_rate",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.09
                },
                "required": true,
                "slot_id": "discount_rate",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.freight_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.02
                },
                "required": true,
                "slot_id": "freight_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.accessories_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.015
                },
                "required": true,
                "slot_id": "accessories_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.brand_material_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.005
                },
                "required": true,
                "slot_id": "brand_material_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.service_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.01
                },
                "required": true,
                "slot_id": "service_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.model_mapping_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "model_mapping_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.capacity_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "capacity_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.channel_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "channel_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-03.new_product_flag",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": false
                },
                "required": true,
                "slot_id": "new_product_flag",
                "state": "BOUND"
              }
            ]
          },
          {
            "blockers": [],
            "entity_id": "ROW-04",
            "instantiable": true,
            "mappings": [
              {
                "concept_key": "product.ROW-04.model",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "model",
                  "value": "MODEL-BETA"
                },
                "required": true,
                "slot_id": "model",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.reporting_line",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "line",
                  "value": "LINE-PLUS"
                },
                "required": true,
                "slot_id": "reporting_line",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.region",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "region",
                  "value": "REGION-SOUTH"
                },
                "required": true,
                "slot_id": "region",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.channel",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "channel",
                  "value": "online"
                },
                "required": true,
                "slot_id": "channel",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.month",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "month",
                  "value": "2026-08"
                },
                "required": true,
                "slot_id": "month",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.quantity",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "units",
                  "value": 650
                },
                "required": true,
                "slot_id": "quantity",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.asp_local",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "LC_per_unit",
                  "value": 1580
                },
                "required": true,
                "slot_id": "asp_local",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.fx_to_reporting",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "RC_per_LC",
                  "value": 0.86
                },
                "required": true,
                "slot_id": "fx_to_reporting",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.unit_cost_local",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "accountant",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "LC_per_unit",
                  "value": 970
                },
                "required": true,
                "slot_id": "unit_cost_local",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.discount_rate",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.11
                },
                "required": true,
                "slot_id": "discount_rate",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.freight_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.025
                },
                "required": true,
                "slot_id": "freight_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.accessories_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.02
                },
                "required": true,
                "slot_id": "accessories_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.brand_material_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.006
                },
                "required": true,
                "slot_id": "brand_material_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.service_ratio",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "ratio",
                  "value": 0.012
                },
                "required": true,
                "slot_id": "service_ratio",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.model_mapping_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "model_mapping_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.capacity_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "capacity_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.channel_confirmed",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "channel_confirmed",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-04.new_product_flag",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": false
                },
                "required": true,
                "slot_id": "new_product_flag",
                "state": "BOUND"
              }
            ]
          },
          {
            "blockers": [
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "reporting_line",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "quantity",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "asp_local",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "accountant confirmation is still required.",
                "slot_id": "unit_cost_local",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "discount_rate",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "freight_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "accessories_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "brand_material_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "service_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "model_mapping_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "capacity_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "channel_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              }
            ],
            "entity_id": "ROW-NP1",
            "instantiable": false,
            "mappings": [
              {
                "concept_key": "product.ROW-NP1.model",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "model",
                  "value": "MODEL-GAMMA"
                },
                "required": true,
                "slot_id": "model",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-NP1.reporting_line",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "line",
                  "value": "LINE-NEW"
                },
                "required": true,
                "slot_id": "reporting_line",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.region",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "region",
                  "value": "REGION-NORTH"
                },
                "required": true,
                "slot_id": "region",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-NP1.channel",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "channel",
                  "value": "online"
                },
                "required": true,
                "slot_id": "channel",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-NP1.month",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "month",
                  "value": "2026-08"
                },
                "required": true,
                "slot_id": "month",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-NP1.quantity",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "low",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "units",
                  "value": 500
                },
                "required": true,
                "slot_id": "quantity",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.asp_local",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "low",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "LC_per_unit",
                  "value": 1900
                },
                "required": true,
                "slot_id": "asp_local",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.fx_to_reporting",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": "banker",
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "RC_per_LC",
                  "value": 0.86
                },
                "required": true,
                "slot_id": "fx_to_reporting",
                "state": "BOUND"
              },
              {
                "concept_key": "product.ROW-NP1.unit_cost_local",
                "reason": "accountant confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "low",
                  "confirmation_owner": "accountant",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "LC_per_unit",
                  "value": 1250
                },
                "required": true,
                "slot_id": "unit_cost_local",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.discount_rate",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "low",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "ratio",
                  "value": 0.1
                },
                "required": true,
                "slot_id": "discount_rate",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.freight_ratio",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "ratio",
                  "value": 0.02
                },
                "required": true,
                "slot_id": "freight_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.accessories_ratio",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "ratio",
                  "value": 0.015
                },
                "required": true,
                "slot_id": "accessories_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.brand_material_ratio",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "ratio",
                  "value": 0.005
                },
                "required": true,
                "slot_id": "brand_material_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.service_ratio",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "ratio",
                  "value": 0.01
                },
                "required": true,
                "slot_id": "service_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.model_mapping_confirmed",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "boolean",
                  "value": false
                },
                "required": true,
                "slot_id": "model_mapping_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.capacity_confirmed",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "boolean",
                  "value": false
                },
                "required": true,
                "slot_id": "capacity_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.channel_confirmed",
                "reason": "banker confirmation is still required.",
                "record": {
                  "authorized_for_binding": false,
                  "classification": null,
                  "confidence": "medium",
                  "confirmation_owner": "banker",
                  "confirmed": false,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": true,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BLOCKED_CONFIRMATION",
                  "unit": "boolean",
                  "value": false
                },
                "required": true,
                "slot_id": "channel_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "concept_key": "product.ROW-NP1.new_product_flag",
                "reason": "Source-ranked, unit-valid and authorized.",
                "record": {
                  "authorized_for_binding": true,
                  "classification": null,
                  "confidence": "high",
                  "confirmation_owner": null,
                  "confirmed": true,
                  "has_conflict": false,
                  "period": "2026-08",
                  "reference": "OPS-PRODUCT-01",
                  "requires_confirmation": false,
                  "source_document_id": "SYN-OPS-001",
                  "source_rank": 1,
                  "source_type": "operating_schedule",
                  "state": "BOUND",
                  "unit": "boolean",
                  "value": true
                },
                "required": true,
                "slot_id": "new_product_flag",
                "state": "BOUND"
              }
            ]
          }
        ],
        "schema": "seed-fit/v1",
        "seed_id": "volume_asp_channel",
        "summary": {
          "blocked": 1,
          "conflicted_bindings": 0,
          "entities": 5,
          "instantiable": 4
        }
      },
      "formula_lineage": {
        "allowed_operators": [
          "add",
          "subtract",
          "multiply",
          "divide",
          "one_minus"
        ],
        "nodes": [
          {
            "inputs": [
              "quantity",
              "asp_local"
            ],
            "node_id": "gross_sales_local",
            "operator": "multiply",
            "output_unit": "LC"
          },
          {
            "inputs": [
              "discount_rate"
            ],
            "node_id": "discount_factor",
            "operator": "one_minus",
            "output_unit": "ratio"
          },
          {
            "inputs": [
              "gross_sales_local",
              "discount_factor"
            ],
            "node_id": "net_product_revenue_local",
            "operator": "multiply",
            "output_unit": "LC"
          },
          {
            "inputs": [
              "net_product_revenue_local",
              "fx_to_reporting"
            ],
            "node_id": "net_product_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "freight_ratio"
            ],
            "node_id": "freight_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "accessories_ratio"
            ],
            "node_id": "accessories_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "brand_material_ratio"
            ],
            "node_id": "brand_material_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "service_ratio"
            ],
            "node_id": "service_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "freight_revenue"
            ],
            "node_id": "revenue_with_freight",
            "operator": "add",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "revenue_with_freight",
              "accessories_revenue"
            ],
            "node_id": "revenue_with_accessories",
            "operator": "add",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "revenue_with_accessories",
              "brand_material_revenue"
            ],
            "node_id": "revenue_with_brand",
            "operator": "add",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "revenue_with_brand",
              "service_revenue"
            ],
            "node_id": "total_revenue",
            "operator": "add",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "quantity",
              "unit_cost_local"
            ],
            "node_id": "product_cost_local",
            "operator": "multiply",
            "output_unit": "LC"
          },
          {
            "inputs": [
              "product_cost_local",
              "fx_to_reporting"
            ],
            "node_id": "product_cost",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "total_revenue",
              "product_cost"
            ],
            "node_id": "gross_profit",
            "operator": "subtract",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "gross_profit",
              "total_revenue"
            ],
            "node_id": "gross_margin",
            "operator": "divide",
            "output_unit": "ratio"
          }
        ]
      },
      "immutability_evidence": {
        "ssot_hash_after": "0ef15c802338a4a9452d51117336f5b56aea46c3aacbcc7ca6e2e3c2a5e13218",
        "ssot_hash_before": "0ef15c802338a4a9452d51117336f5b56aea46c3aacbcc7ca6e2e3c2a5e13218",
        "unchanged": true
      },
      "model": {
        "blocked_rows": [
          {
            "blockers": [
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "reporting_line",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "quantity",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "asp_local",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "accountant confirmation is still required.",
                "slot_id": "unit_cost_local",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "discount_rate",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "freight_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "accessories_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "brand_material_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "service_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "model_mapping_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "capacity_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "channel_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              }
            ],
            "entity_id": "ROW-NP1",
            "state": "BLOCKED"
          }
        ],
        "group_rollup": [
          {
            "dimensions": {},
            "gross_margin": 0.361945,
            "gross_profit": 1297254.0854,
            "product_cost": 2286870,
            "revenue": 3584124.0854
          }
        ],
        "model_rollup": [
          {
            "dimensions": {
              "model": "MODEL-ALPHA"
            },
            "gross_margin": 0.374843,
            "gross_profit": 696457.26,
            "product_cost": 1161540,
            "revenue": 1857997.26
          },
          {
            "dimensions": {
              "model": "MODEL-BETA"
            },
            "gross_margin": 0.348061,
            "gross_profit": 600796.8254,
            "product_cost": 1125330,
            "revenue": 1726126.8254
          }
        ],
        "month_rollup": [
          {
            "dimensions": {
              "month": "2026-07"
            },
            "gross_margin": 0.362905,
            "gross_profit": 680758.88,
            "product_cost": 1195100,
            "revenue": 1875858.88
          },
          {
            "dimensions": {
              "month": "2026-08"
            },
            "gross_margin": 0.36089,
            "gross_profit": 616495.2054,
            "product_cost": 1091770,
            "revenue": 1708265.2054
          }
        ],
        "question_answered": "What revenue and gross profit follow from monthly product quantity, price, channel, geography, FX and unit cost?",
        "region_channel_rollup": [
          {
            "dimensions": {
              "channel": "offline",
              "region": "REGION-NORTH"
            },
            "gross_margin": 0.370283,
            "gross_profit": 323137.26,
            "product_cost": 549540,
            "revenue": 872677.26
          },
          {
            "dimensions": {
              "channel": "online",
              "region": "REGION-NORTH"
            },
            "gross_margin": 0.378882,
            "gross_profit": 373320,
            "product_cost": 612000,
            "revenue": 985320
          },
          {
            "dimensions": {
              "channel": "offline",
              "region": "REGION-SOUTH"
            },
            "gross_margin": 0.345228,
            "gross_profit": 307438.88,
            "product_cost": 583100,
            "revenue": 890538.88
          },
          {
            "dimensions": {
              "channel": "online",
              "region": "REGION-SOUTH"
            },
            "gross_margin": 0.35108,
            "gross_profit": 293357.9454,
            "product_cost": 542230,
            "revenue": 835587.9454
          }
        ],
        "row_calculations": [
          {
            "bound_inputs": {
              "accessories_ratio": 0.015,
              "asp_local": 1200,
              "brand_material_ratio": 0.005,
              "capacity_confirmed": true,
              "channel": "online",
              "channel_confirmed": true,
              "discount_rate": 0.08,
              "freight_ratio": 0.02,
              "fx_to_reporting": 0.85,
              "model": "MODEL-ALPHA",
              "model_mapping_confirmed": true,
              "month": "2026-07",
              "new_product_flag": false,
              "quantity": 1000,
              "region": "REGION-NORTH",
              "reporting_line": "LINE-CORE",
              "service_ratio": 0.01,
              "unit_cost_local": 720
            },
            "calculated": {
              "accessories_revenue": 14076,
              "brand_material_revenue": 4692,
              "discount_factor": 0.92,
              "freight_revenue": 18768,
              "gross_margin": 0.378882,
              "gross_profit": 373320,
              "gross_sales_local": 1200000,
              "net_product_revenue": 938400,
              "net_product_revenue_local": 1104000,
              "product_cost": 612000,
              "product_cost_local": 720000,
              "revenue_with_accessories": 971244,
              "revenue_with_brand": 975936,
              "revenue_with_freight": 957168,
              "service_revenue": 9384,
              "total_revenue": 985320
            },
            "dimensions": {
              "channel": "online",
              "model": "MODEL-ALPHA",
              "month": "2026-07",
              "region": "REGION-NORTH",
              "reporting_line": "LINE-CORE"
            },
            "entity_id": "ROW-01",
            "state": "CALCULATED"
          },
          {
            "bound_inputs": {
              "accessories_ratio": 0.02,
              "asp_local": 1600,
              "brand_material_ratio": 0.006,
              "capacity_confirmed": true,
              "channel": "offline",
              "channel_confirmed": true,
              "discount_rate": 0.12,
              "freight_ratio": 0.025,
              "fx_to_reporting": 0.85,
              "model": "MODEL-BETA",
              "model_mapping_confirmed": true,
              "month": "2026-07",
              "new_product_flag": false,
              "quantity": 700,
              "region": "REGION-SOUTH",
              "reporting_line": "LINE-PLUS",
              "service_ratio": 0.012,
              "unit_cost_local": 980
            },
            "calculated": {
              "accessories_revenue": 16755.2,
              "brand_material_revenue": 5026.56,
              "discount_factor": 0.88,
              "freight_revenue": 20944,
              "gross_margin": 0.345228,
              "gross_profit": 307438.88,
              "gross_sales_local": 1120000,
              "net_product_revenue": 837760,
              "net_product_revenue_local": 985600,
              "product_cost": 583100,
              "product_cost_local": 686000,
              "revenue_with_accessories": 875459.2,
              "revenue_with_brand": 880485.76,
              "revenue_with_freight": 858704,
              "service_revenue": 10053.12,
              "total_revenue": 890538.88
            },
            "dimensions": {
              "channel": "offline",
              "model": "MODEL-BETA",
              "month": "2026-07",
              "region": "REGION-SOUTH",
              "reporting_line": "LINE-PLUS"
            },
            "entity_id": "ROW-02",
            "state": "CALCULATED"
          },
          {
            "bound_inputs": {
              "accessories_ratio": 0.015,
              "asp_local": 1180,
              "brand_material_ratio": 0.005,
              "capacity_confirmed": true,
              "channel": "offline",
              "channel_confirmed": true,
              "discount_rate": 0.09,
              "freight_ratio": 0.02,
              "fx_to_reporting": 0.86,
              "model": "MODEL-ALPHA",
              "model_mapping_confirmed": true,
              "month": "2026-08",
              "new_product_flag": false,
              "quantity": 900,
              "region": "REGION-NORTH",
              "reporting_line": "LINE-CORE",
              "service_ratio": 0.01,
              "unit_cost_local": 710
            },
            "calculated": {
              "accessories_revenue": 12466.818,
              "brand_material_revenue": 4155.606,
              "discount_factor": 0.91,
              "freight_revenue": 16622.424,
              "gross_margin": 0.370283,
              "gross_profit": 323137.26,
              "gross_sales_local": 1062000,
              "net_product_revenue": 831121.2,
              "net_product_revenue_local": 966420,
              "product_cost": 549540,
              "product_cost_local": 639000,
              "revenue_with_accessories": 860210.442,
              "revenue_with_brand": 864366.048,
              "revenue_with_freight": 847743.624,
              "service_revenue": 8311.212,
              "total_revenue": 872677.26
            },
            "dimensions": {
              "channel": "offline",
              "model": "MODEL-ALPHA",
              "month": "2026-08",
              "region": "REGION-NORTH",
              "reporting_line": "LINE-CORE"
            },
            "entity_id": "ROW-03",
            "state": "CALCULATED"
          },
          {
            "bound_inputs": {
              "accessories_ratio": 0.02,
              "asp_local": 1580,
              "brand_material_ratio": 0.006,
              "capacity_confirmed": true,
              "channel": "online",
              "channel_confirmed": true,
              "discount_rate": 0.11,
              "freight_ratio": 0.025,
              "fx_to_reporting": 0.86,
              "model": "MODEL-BETA",
              "model_mapping_confirmed": true,
              "month": "2026-08",
              "new_product_flag": false,
              "quantity": 650,
              "region": "REGION-SOUTH",
              "reporting_line": "LINE-PLUS",
              "service_ratio": 0.012,
              "unit_cost_local": 970
            },
            "calculated": {
              "accessories_revenue": 15721.316,
              "brand_material_revenue": 4716.3948,
              "discount_factor": 0.89,
              "freight_revenue": 19651.645,
              "gross_margin": 0.35108,
              "gross_profit": 293357.9454,
              "gross_sales_local": 1027000,
              "net_product_revenue": 786065.8,
              "net_product_revenue_local": 914030,
              "product_cost": 542230,
              "product_cost_local": 630500,
              "revenue_with_accessories": 821438.761,
              "revenue_with_brand": 826155.1558,
              "revenue_with_freight": 805717.445,
              "service_revenue": 9432.7896,
              "total_revenue": 835587.9454
            },
            "dimensions": {
              "channel": "online",
              "model": "MODEL-BETA",
              "month": "2026-08",
              "region": "REGION-SOUTH",
              "reporting_line": "LINE-PLUS"
            },
            "entity_id": "ROW-04",
            "state": "CALCULATED"
          },
          {
            "blockers": [
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "reporting_line",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "quantity",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "asp_local",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "accountant confirmation is still required.",
                "slot_id": "unit_cost_local",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "discount_rate",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "freight_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "accessories_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "brand_material_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "service_ratio",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "model_mapping_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "capacity_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              },
              {
                "reason": "banker confirmation is still required.",
                "slot_id": "channel_confirmed",
                "state": "BLOCKED_CONFIRMATION"
              }
            ],
            "entity_id": "ROW-NP1",
            "state": "BLOCKED"
          }
        ],
        "sensitivities": [
          {
            "group": {
              "dimensions": {},
              "gross_margin": 0.328363,
              "gross_profit": 1118047.88113,
              "product_cost": 2286870,
              "revenue": 3404917.88113
            },
            "scenario": "ASP -5%",
            "status": "ILLUSTRATIVE_NOT_BASE"
          },
          {
            "group": {
              "dimensions": {},
              "gross_margin": 0.361945,
              "gross_profit": 1167528.67686,
              "product_cost": 2058183,
              "revenue": 3225711.67686
            },
            "scenario": "Quantity -10%",
            "status": "ILLUSTRATIVE_NOT_BASE"
          }
        ],
        "state": "CALCULATED_WITH_BLOCKED_RAMP"
      },
      "model_identity": {
        "concept_pack_sha256": "c4b4a4dc82da431b66f22eadb1aad2713a814f6e146fe7bf8f89165d5b329d58",
        "formula_dag_sha256": "b5cc4c64a32c0bc41b232adb0b6c0c41ccb4bcf4a770a6cbfb4ad28e50797331",
        "model_identity_sha256": "49090e3f274b4876fd29a79b407d1fe49d92ea8641ab6f962ce3a12f58d799c7",
        "seed_id": "volume_asp_channel",
        "seed_sha256": "7677b3d42d4aa8f2b0cd3c05700524fdd86160249b8e30f877ddecd4bf7a69dc",
        "seed_version": "1.0.0",
        "ssot_sha256": "64cac5da38650d03ede91d74ca37b34337aaa49276ecdd00256e0b94ae168aa0"
      },
      "schema": "instantiated-driver-model/v1",
      "seed_id": "volume_asp_channel",
      "seed_version": "1.0.0"
    }
  },
  "schema": "three-seed-ui-bootstrap/v2",
  "seed_raw": {
    "backlog_conversion": "{\n  \"schema\": \"driver-seed/v1\",\n  \"seed_id\": \"backlog_conversion\",\n  \"version\": \"1.0.0\",\n  \"title\": \"Backlog / Contract Conversion\",\n  \"question\": \"How much signed commercial work remains, how did it move, and what visibility sits outside secured backlog?\",\n  \"provenance\": {\n    \"archaeology_refs\": [\"ACTUAL-C-DISCLOSURE\", \"ACTUAL-C-MODEL\", \"ACTUAL-C-SESSION\"],\n    \"structural_source_sha256\": [\"6dae3ed530a0723f2904882cda5fafe637aef87f16ee2f1714d61d32d2da6e60\", \"e45692ad2fcf7328cfb9ffaa444aee67fd9b134e8412683f1c2cf8d42d3ffd1c\", \"1eff49a66773db4554164388adfa2114b7598e0343a292e78fafc35810ab85c6\"]\n  },\n  \"applicable_business_model_signals\": [\"project awards\", \"signed contracts\", \"backlog movement\", \"framework arrangements\", \"pipeline\", \"conversion timing\"],\n  \"scope_prefix\": \"backlog\",\n  \"entity_mode\": \"singleton\",\n  \"required_concept_slots\": [\n    {\"slot_id\": \"opening_value\", \"concept_suffix\": \"opening_value\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand_ex_tax\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"opening_count\", \"concept_suffix\": \"opening_count\", \"required\": true, \"type\": \"integer\", \"allowed_units\": [\"projects\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"signed_additions_value\", \"concept_suffix\": \"signed_additions_value\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand_ex_tax\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"signed_additions_count\", \"concept_suffix\": \"signed_additions_count\", \"required\": true, \"type\": \"integer\", \"allowed_units\": [\"projects\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"approved_variations\", \"concept_suffix\": \"approved_variations\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand_ex_tax\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"revenue_recognized\", \"concept_suffix\": \"revenue_recognized\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand_ex_tax\"], \"authorization\": \"accountant_confirmed\"},\n    {\"slot_id\": \"terminated_value\", \"concept_suffix\": \"terminated_value\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand_ex_tax\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"completed_count\", \"concept_suffix\": \"completed_count\", \"required\": true, \"type\": \"integer\", \"allowed_units\": [\"projects\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"terminated_count\", \"concept_suffix\": \"terminated_count\", \"required\": true, \"type\": \"integer\", \"allowed_units\": [\"projects\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"classification_policy_confirmed\", \"concept_suffix\": \"classification_policy_confirmed\", \"required\": true, \"type\": \"boolean\", \"allowed_units\": [\"boolean\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"framework_value\", \"concept_suffix\": \"framework_value\", \"required\": false, \"type\": \"number\", \"allowed_units\": [\"CU_thousand_ex_tax\"], \"authorization\": \"source_bound\"},\n    {\"slot_id\": \"negotiation_pipeline_value\", \"concept_suffix\": \"negotiation_pipeline_value\", \"required\": false, \"type\": \"number\", \"allowed_units\": [\"CU_thousand_ex_tax\"], \"authorization\": \"source_bound\"},\n    {\"slot_id\": \"framework_scenario_probability\", \"concept_suffix\": \"framework_scenario_probability\", \"required\": false, \"type\": \"number\", \"allowed_units\": [\"ratio\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"loss_making_project_count\", \"concept_suffix\": \"loss_making_project_count\", \"required\": false, \"type\": \"integer\", \"allowed_units\": [\"projects\"], \"authorization\": \"accountant_confirmed\"},\n    {\"slot_id\": \"top_customer_concentration\", \"concept_suffix\": \"top_customer_concentration\", \"required\": false, \"type\": \"number\", \"allowed_units\": [\"ratio\"], \"authorization\": \"banker_confirmed\"}\n  ],\n  \"driver_registry_schema\": {\n    \"grain\": \"backlog_period\",\n    \"driver_fields\": [\"opening_value\", \"signed_additions_value\", \"approved_variations\", \"revenue_recognized\", \"terminated_value\"],\n    \"dimensions\": [\"period\", \"contract_status\", \"start_status\", \"customer_bucket\"]\n  },\n  \"formula_lineage\": {\n    \"allowed_operators\": [\"add\", \"subtract\"],\n    \"nodes\": [\n      {\"node_id\": \"gross_signed_backlog\", \"operator\": \"add\", \"inputs\": [\"opening_value\", \"signed_additions_value\"], \"output_unit\": \"CU_thousand_ex_tax\"},\n      {\"node_id\": \"post_variation_backlog\", \"operator\": \"add\", \"inputs\": [\"gross_signed_backlog\", \"approved_variations\"], \"output_unit\": \"CU_thousand_ex_tax\"},\n      {\"node_id\": \"value_reductions\", \"operator\": \"add\", \"inputs\": [\"revenue_recognized\", \"terminated_value\"], \"output_unit\": \"CU_thousand_ex_tax\"},\n      {\"node_id\": \"closing_backlog_value\", \"operator\": \"subtract\", \"inputs\": [\"post_variation_backlog\", \"value_reductions\"], \"output_unit\": \"CU_thousand_ex_tax\"},\n      {\"node_id\": \"gross_project_count\", \"operator\": \"add\", \"inputs\": [\"opening_count\", \"signed_additions_count\"], \"output_unit\": \"projects\"},\n      {\"node_id\": \"count_reductions\", \"operator\": \"add\", \"inputs\": [\"completed_count\", \"terminated_count\"], \"output_unit\": \"projects\"},\n      {\"node_id\": \"closing_backlog_count\", \"operator\": \"subtract\", \"inputs\": [\"gross_project_count\", \"count_reductions\"], \"output_unit\": \"projects\"}\n    ]\n  },\n  \"bounds_control_policy\": [\n    {\"control_id\": \"NON_NEGATIVE_BACKLOG\", \"field\": \"closing_backlog_value\", \"min\": 0, \"breach\": \"hard_fail\"},\n    {\"control_id\": \"COUNT_RECONCILIATION\", \"field\": \"closing_backlog_count\", \"min\": 0, \"integer\": true, \"breach\": \"hard_fail\"},\n    {\"control_id\": \"SIGNED_ONLY\", \"field\": \"closing_backlog_value\", \"excluded_classes\": [\"framework_only\", \"negotiation_stage\"], \"breach\": \"hard_fail\"},\n    {\"control_id\": \"PROBABILITY_SCENARIO_AUTH\", \"field\": \"framework_scenario_probability\", \"breach\": \"blocked_until_banker_confirmed\"},\n    {\"control_id\": \"LOSS_AND_CONCENTRATION_VISIBILITY\", \"fields\": [\"loss_making_project_count\", \"top_customer_concentration\"], \"breach\": \"visible_flag\"}\n  ],\n  \"authorization_confirmation_rules\": {\n    \"accountant\": [\"revenue_recognized\", \"loss_making_project_count\"],\n    \"banker\": [\"signed_status\", \"variations\", \"termination\", \"probability_scenario\", \"concentration\"],\n    \"framework_never_secured_by_probability\": true,\n    \"relaxation_allowed\": false\n  },\n  \"output_schema\": [\"signed_roll_forward\", \"separate_visibility_buckets\", \"timing_sensitivity\", \"controls\", \"lineage\", \"model_identity\"],\n  \"failure_anti_pattern_checks\": [\"framework_relabelled_as_signed\", \"negotiation_relabelled_as_signed\", \"unreconciled_value\", \"unreconciled_count\", \"silent_probability_weighting\", \"negative_backlog\", \"loss_making_hidden\", \"concentration_hidden\", \"unknown_operator\", \"external_code\", \"hidden_plug\", \"authorization_relaxation\"],\n  \"no_company_data\": {\"attested\": true, \"statement\": \"This artifact contains reusable grammar only; it contains no issuer, customer, project, product or baseline value.\"},\n  \"integrity\": {\"algorithm\": \"sha256\", \"value_location\": \"backlog_conversion.seed.json.sha256\"}\n}\n",
    "project_progress": "{\n  \"schema\": \"driver-seed/v1\",\n  \"seed_id\": \"project_progress\",\n  \"version\": \"1.0.0\",\n  \"title\": \"Project Progress / Cost-to-complete\",\n  \"question\": \"How much project revenue, cost, gross profit and working-capital exposure follows from approved progress evidence?\",\n  \"provenance\": {\n    \"archaeology_refs\": [\"ACTUAL-A-WORKBOOK\", \"ACTUAL-A-DISCLOSURE\", \"ACTUAL-A-QA\"],\n    \"structural_source_sha256\": [\"6dae3ed530a0723f2904882cda5fafe637aef87f16ee2f1714d61d32d2da6e60\", \"e45692ad2fcf7328cfb9ffaa444aee67fd9b134e8412683f1c2cf8d42d3ffd1c\", \"cb62da7f43389a96ac9bea442a01f2164ea6daaf31de602d526b155c89750d87\", \"688b6cd14ddb4f1c155ed07b2cfdafac93f8fe46c9c2fd2a6f085f56f9f03b73\"]\n  },\n  \"applicable_business_model_signals\": [\"project contracts\", \"over-time revenue\", \"cost input method\", \"milestones\", \"contract assets\"],\n  \"scope_prefix\": \"project\",\n  \"entity_mode\": \"repeated\",\n  \"required_concept_slots\": [\n    {\"slot_id\": \"identity\", \"concept_suffix\": \"identity\", \"required\": true, \"type\": \"string\", \"allowed_units\": [\"id\"], \"authorization\": \"source_bound\"},\n    {\"slot_id\": \"transaction_price\", \"concept_suffix\": \"transaction_price\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand_ex_tax\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"cost_incurred_to_date\", \"concept_suffix\": \"cost_incurred_to_date\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand\"], \"authorization\": \"accountant_confirmed\"},\n    {\"slot_id\": \"expected_total_cost\", \"concept_suffix\": \"expected_total_cost\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"expected_total_cost_version\", \"concept_suffix\": \"expected_total_cost_version\", \"required\": true, \"type\": \"string\", \"allowed_units\": [\"version\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"prior_expected_total_cost\", \"concept_suffix\": \"prior_expected_total_cost\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand\"], \"authorization\": \"source_bound\"},\n    {\"slot_id\": \"prior_cumulative_revenue\", \"concept_suffix\": \"prior_cumulative_revenue\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand\"], \"authorization\": \"accountant_confirmed\"},\n    {\"slot_id\": \"prior_cumulative_cost\", \"concept_suffix\": \"prior_cumulative_cost\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand\"], \"authorization\": \"accountant_confirmed\"},\n    {\"slot_id\": \"cumulative_billings\", \"concept_suffix\": \"cumulative_billings\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"cumulative_cash_collected\", \"concept_suffix\": \"cumulative_cash_collected\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"CU_thousand\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"revenue_policy_confirmed\", \"concept_suffix\": \"revenue_policy_confirmed\", \"required\": true, \"type\": \"boolean\", \"allowed_units\": [\"boolean\"], \"authorization\": \"accountant_confirmed\"},\n    {\"slot_id\": \"milestone_status\", \"concept_suffix\": \"milestone_status\", \"required\": true, \"type\": \"string\", \"allowed_units\": [\"status\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"cumulative_progress_reported\", \"concept_suffix\": \"cumulative_progress_reported\", \"required\": false, \"type\": \"number\", \"allowed_units\": [\"ratio\"], \"authorization\": \"banker_confirmed\"}\n  ],\n  \"driver_registry_schema\": {\n    \"grain\": \"project_period\",\n    \"driver_fields\": [\"transaction_price\", \"cost_incurred_to_date\", \"expected_total_cost\", \"prior_cumulative_revenue\", \"prior_cumulative_cost\", \"cumulative_billings\", \"cumulative_cash_collected\"],\n    \"dimensions\": [\"identity\", \"period\", \"expected_total_cost_version\", \"milestone_status\"]\n  },\n  \"formula_lineage\": {\n    \"allowed_operators\": [\"add\", \"subtract\", \"multiply\", \"divide\", \"max_zero\"],\n    \"nodes\": [\n      {\"node_id\": \"cumulative_progress\", \"operator\": \"divide\", \"inputs\": [\"cost_incurred_to_date\", \"expected_total_cost\"], \"output_unit\": \"ratio\"},\n      {\"node_id\": \"cumulative_revenue\", \"operator\": \"multiply\", \"inputs\": [\"transaction_price\", \"cumulative_progress\"], \"output_unit\": \"CU_thousand\"},\n      {\"node_id\": \"current_period_revenue\", \"operator\": \"subtract\", \"inputs\": [\"cumulative_revenue\", \"prior_cumulative_revenue\"], \"output_unit\": \"CU_thousand\"},\n      {\"node_id\": \"current_period_cost\", \"operator\": \"subtract\", \"inputs\": [\"cost_incurred_to_date\", \"prior_cumulative_cost\"], \"output_unit\": \"CU_thousand\"},\n      {\"node_id\": \"project_gp\", \"operator\": \"subtract\", \"inputs\": [\"current_period_revenue\", \"current_period_cost\"], \"output_unit\": \"CU_thousand\"},\n      {\"node_id\": \"project_gp_margin\", \"operator\": \"divide\", \"inputs\": [\"project_gp\", \"current_period_revenue\"], \"output_unit\": \"ratio\"},\n      {\"node_id\": \"unconditional_receivable_raw\", \"operator\": \"subtract\", \"inputs\": [\"cumulative_billings\", \"cumulative_cash_collected\"], \"output_unit\": \"CU_thousand\"},\n      {\"node_id\": \"receivable\", \"operator\": \"max_zero\", \"inputs\": [\"unconditional_receivable_raw\"], \"output_unit\": \"CU_thousand\"},\n      {\"node_id\": \"contract_asset_raw\", \"operator\": \"subtract\", \"inputs\": [\"cumulative_revenue\", \"cumulative_billings\"], \"output_unit\": \"CU_thousand\"},\n      {\"node_id\": \"contract_asset\", \"operator\": \"max_zero\", \"inputs\": [\"contract_asset_raw\"], \"output_unit\": \"CU_thousand\"}\n    ]\n  },\n  \"bounds_control_policy\": [\n    {\"control_id\": \"PROGRESS_RANGE\", \"field\": \"cumulative_progress\", \"min\": 0, \"max\": 1, \"breach\": \"hard_fail\", \"silent_clip\": false},\n    {\"control_id\": \"ETC_POSITIVE\", \"field\": \"expected_total_cost\", \"exclusive_min\": 0, \"breach\": \"hard_fail\"},\n    {\"control_id\": \"ETC_REVISION_CATCH_UP\", \"fields\": [\"prior_expected_total_cost\", \"expected_total_cost\"], \"breach\": \"visible_flag\"},\n    {\"control_id\": \"NEGATIVE_CATCH_UP\", \"field\": \"current_period_revenue\", \"min\": 0, \"breach\": \"visible_flag\"},\n    {\"control_id\": \"EXPECTED_LOSS\", \"fields\": [\"transaction_price\", \"expected_total_cost\"], \"breach\": \"accountant_confirmation_and_visible_flag\"}\n  ],\n  \"authorization_confirmation_rules\": {\n    \"accountant\": [\"revenue_policy_confirmed\", \"cost_incurred_to_date\", \"prior_cumulative_revenue\", \"prior_cumulative_cost\", \"expected_loss_treatment\"],\n    \"banker\": [\"transaction_price\", \"expected_total_cost\", \"estimate_version\", \"milestones\", \"billings\", \"cash_collection\"],\n    \"relaxation_allowed\": false\n  },\n  \"output_schema\": [\"project_rows\", \"period_aggregate\", \"lineage\", \"controls\", \"sensitivities\", \"model_identity\"],\n  \"failure_anti_pattern_checks\": [\"progress_above_100_percent\", \"silent_progress_clipping\", \"missing_expected_total_cost_version\", \"negative_catch_up_hidden\", \"expected_loss_hidden\", \"billing_cash_bridge_missing\", \"unknown_operator\", \"external_code\", \"hidden_plug\", \"authorization_relaxation\"],\n  \"no_company_data\": {\"attested\": true, \"statement\": \"This artifact contains reusable grammar only; it contains no issuer, customer, project, product or baseline value.\"},\n  \"integrity\": {\"algorithm\": \"sha256\", \"value_location\": \"project_progress.seed.json.sha256\"}\n}\n",
    "volume_asp_channel": "{\n  \"schema\": \"driver-seed/v1\",\n  \"seed_id\": \"volume_asp_channel\",\n  \"version\": \"1.0.0\",\n  \"title\": \"Volume × ASP / Product × Region × Channel\",\n  \"question\": \"What revenue and gross profit follow from monthly product quantity, price, channel, geography, FX and unit cost?\",\n  \"provenance\": {\n    \"archaeology_refs\": [\"ACTUAL-B-WORKBOOK\"],\n    \"structural_source_sha256\": [\"f5dfb9fd48c724b1f026fa9ce99e2533d22755a49f5d8f113f9ee8b4af5d6c39\"]\n  },\n  \"applicable_business_model_signals\": [\"product models\", \"monthly quantity\", \"ASP or RRP\", \"region\", \"online/offline\", \"FX\", \"unit cost\", \"new-product ramp\"],\n  \"scope_prefix\": \"product\",\n  \"entity_mode\": \"repeated\",\n  \"required_concept_slots\": [\n    {\"slot_id\": \"model\", \"concept_suffix\": \"model\", \"required\": true, \"type\": \"string\", \"allowed_units\": [\"model\"], \"authorization\": \"source_bound\"},\n    {\"slot_id\": \"reporting_line\", \"concept_suffix\": \"reporting_line\", \"required\": true, \"type\": \"string\", \"allowed_units\": [\"line\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"region\", \"concept_suffix\": \"region\", \"required\": true, \"type\": \"string\", \"allowed_units\": [\"region\"], \"authorization\": \"source_bound\"},\n    {\"slot_id\": \"channel\", \"concept_suffix\": \"channel\", \"required\": true, \"type\": \"string\", \"allowed_units\": [\"channel\"], \"authorization\": \"source_bound\"},\n    {\"slot_id\": \"month\", \"concept_suffix\": \"month\", \"required\": true, \"type\": \"string\", \"allowed_units\": [\"month\"], \"authorization\": \"source_bound\"},\n    {\"slot_id\": \"quantity\", \"concept_suffix\": \"quantity\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"units\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"asp_local\", \"concept_suffix\": \"asp_local\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"LC_per_unit\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"fx_to_reporting\", \"concept_suffix\": \"fx_to_reporting\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"RC_per_LC\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"unit_cost_local\", \"concept_suffix\": \"unit_cost_local\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"LC_per_unit\"], \"authorization\": \"accountant_confirmed\"},\n    {\"slot_id\": \"discount_rate\", \"concept_suffix\": \"discount_rate\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"ratio\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"freight_ratio\", \"concept_suffix\": \"freight_ratio\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"ratio\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"accessories_ratio\", \"concept_suffix\": \"accessories_ratio\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"ratio\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"brand_material_ratio\", \"concept_suffix\": \"brand_material_ratio\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"ratio\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"service_ratio\", \"concept_suffix\": \"service_ratio\", \"required\": true, \"type\": \"number\", \"allowed_units\": [\"ratio\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"model_mapping_confirmed\", \"concept_suffix\": \"model_mapping_confirmed\", \"required\": true, \"type\": \"boolean\", \"allowed_units\": [\"boolean\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"capacity_confirmed\", \"concept_suffix\": \"capacity_confirmed\", \"required\": true, \"type\": \"boolean\", \"allowed_units\": [\"boolean\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"channel_confirmed\", \"concept_suffix\": \"channel_confirmed\", \"required\": true, \"type\": \"boolean\", \"allowed_units\": [\"boolean\"], \"authorization\": \"banker_confirmed\"},\n    {\"slot_id\": \"new_product_flag\", \"concept_suffix\": \"new_product_flag\", \"required\": true, \"type\": \"boolean\", \"allowed_units\": [\"boolean\"], \"authorization\": \"source_bound\"}\n  ],\n  \"driver_registry_schema\": {\n    \"grain\": \"model_region_channel_month\",\n    \"driver_fields\": [\"quantity\", \"asp_local\", \"fx_to_reporting\", \"unit_cost_local\", \"discount_rate\", \"freight_ratio\", \"accessories_ratio\", \"brand_material_ratio\", \"service_ratio\"],\n    \"dimensions\": [\"model\", \"reporting_line\", \"region\", \"channel\", \"month\"]\n  },\n  \"formula_lineage\": {\n    \"allowed_operators\": [\"add\", \"subtract\", \"multiply\", \"divide\", \"one_minus\"],\n    \"nodes\": [\n      {\"node_id\": \"gross_sales_local\", \"operator\": \"multiply\", \"inputs\": [\"quantity\", \"asp_local\"], \"output_unit\": \"LC\"},\n      {\"node_id\": \"discount_factor\", \"operator\": \"one_minus\", \"inputs\": [\"discount_rate\"], \"output_unit\": \"ratio\"},\n      {\"node_id\": \"net_product_revenue_local\", \"operator\": \"multiply\", \"inputs\": [\"gross_sales_local\", \"discount_factor\"], \"output_unit\": \"LC\"},\n      {\"node_id\": \"net_product_revenue\", \"operator\": \"multiply\", \"inputs\": [\"net_product_revenue_local\", \"fx_to_reporting\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"freight_revenue\", \"operator\": \"multiply\", \"inputs\": [\"net_product_revenue\", \"freight_ratio\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"accessories_revenue\", \"operator\": \"multiply\", \"inputs\": [\"net_product_revenue\", \"accessories_ratio\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"brand_material_revenue\", \"operator\": \"multiply\", \"inputs\": [\"net_product_revenue\", \"brand_material_ratio\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"service_revenue\", \"operator\": \"multiply\", \"inputs\": [\"net_product_revenue\", \"service_ratio\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"revenue_with_freight\", \"operator\": \"add\", \"inputs\": [\"net_product_revenue\", \"freight_revenue\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"revenue_with_accessories\", \"operator\": \"add\", \"inputs\": [\"revenue_with_freight\", \"accessories_revenue\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"revenue_with_brand\", \"operator\": \"add\", \"inputs\": [\"revenue_with_accessories\", \"brand_material_revenue\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"total_revenue\", \"operator\": \"add\", \"inputs\": [\"revenue_with_brand\", \"service_revenue\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"product_cost_local\", \"operator\": \"multiply\", \"inputs\": [\"quantity\", \"unit_cost_local\"], \"output_unit\": \"LC\"},\n      {\"node_id\": \"product_cost\", \"operator\": \"multiply\", \"inputs\": [\"product_cost_local\", \"fx_to_reporting\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"gross_profit\", \"operator\": \"subtract\", \"inputs\": [\"total_revenue\", \"product_cost\"], \"output_unit\": \"RC\"},\n      {\"node_id\": \"gross_margin\", \"operator\": \"divide\", \"inputs\": [\"gross_profit\", \"total_revenue\"], \"output_unit\": \"ratio\"}\n    ]\n  },\n  \"bounds_control_policy\": [\n    {\"control_id\": \"QUANTITY_NON_NEGATIVE\", \"field\": \"quantity\", \"min\": 0, \"breach\": \"hard_fail\"},\n    {\"control_id\": \"RATIO_RANGE\", \"fields\": [\"discount_rate\", \"freight_ratio\", \"accessories_ratio\", \"brand_material_ratio\", \"service_ratio\"], \"min\": 0, \"max\": 1, \"breach\": \"hard_fail\"},\n    {\"control_id\": \"FX_POSITIVE\", \"field\": \"fx_to_reporting\", \"exclusive_min\": 0, \"breach\": \"hard_fail\"},\n    {\"control_id\": \"MODEL_MAPPING\", \"field\": \"model_mapping_confirmed\", \"breach\": \"blocked_until_banker_confirmed\"},\n    {\"control_id\": \"NEW_PRODUCT_RAMP\", \"fields\": [\"new_product_flag\", \"capacity_confirmed\", \"channel_confirmed\"], \"breach\": \"blocked_until_banker_confirmed\"},\n    {\"control_id\": \"ROLLUP_RECONCILIATION\", \"fields\": [\"model\", \"region\", \"channel\", \"month\", \"total_revenue\", \"product_cost\"], \"breach\": \"hard_fail\"}\n  ],\n  \"authorization_confirmation_rules\": {\n    \"accountant\": [\"unit_cost_local\"],\n    \"banker\": [\"quantity\", \"asp_local\", \"fx\", \"discount\", \"add_on_ratios\", \"mapping\", \"capacity\", \"channel_orders\"],\n    \"relaxation_allowed\": false\n  },\n  \"output_schema\": [\"row_calculations\", \"model_rollup\", \"region_channel_rollup\", \"group_rollup\", \"controls\", \"lineage\", \"sensitivities\", \"model_identity\"],\n  \"failure_anti_pattern_checks\": [\"wrong_unit\", \"missing_fx\", \"unconfirmed_mapping\", \"unconfirmed_new_product_ramp\", \"rollup_mismatch\", \"hidden_add_on_plug\", \"unknown_operator\", \"external_code\", \"hidden_plug\", \"authorization_relaxation\"],\n  \"no_company_data\": {\"attested\": true, \"statement\": \"This artifact contains reusable grammar only; it contains no issuer, customer, project, product or baseline value.\"},\n  \"integrity\": {\"algorithm\": \"sha256\", \"value_location\": \"volume_asp_channel.seed.json.sha256\"}\n}\n"
  },
  "seeds": {
    "backlog_conversion": {
      "applicable_business_model_signals": [
        "project awards",
        "signed contracts",
        "backlog movement",
        "framework arrangements",
        "pipeline",
        "conversion timing"
      ],
      "authorization_confirmation_rules": {
        "accountant": [
          "revenue_recognized",
          "loss_making_project_count"
        ],
        "banker": [
          "signed_status",
          "variations",
          "termination",
          "probability_scenario",
          "concentration"
        ],
        "framework_never_secured_by_probability": true,
        "relaxation_allowed": false
      },
      "bounds_control_policy": [
        {
          "breach": "hard_fail",
          "control_id": "NON_NEGATIVE_BACKLOG",
          "field": "closing_backlog_value",
          "min": 0
        },
        {
          "breach": "hard_fail",
          "control_id": "COUNT_RECONCILIATION",
          "field": "closing_backlog_count",
          "integer": true,
          "min": 0
        },
        {
          "breach": "hard_fail",
          "control_id": "SIGNED_ONLY",
          "excluded_classes": [
            "framework_only",
            "negotiation_stage"
          ],
          "field": "closing_backlog_value"
        },
        {
          "breach": "blocked_until_banker_confirmed",
          "control_id": "PROBABILITY_SCENARIO_AUTH",
          "field": "framework_scenario_probability"
        },
        {
          "breach": "visible_flag",
          "control_id": "LOSS_AND_CONCENTRATION_VISIBILITY",
          "fields": [
            "loss_making_project_count",
            "top_customer_concentration"
          ]
        }
      ],
      "driver_registry_schema": {
        "dimensions": [
          "period",
          "contract_status",
          "start_status",
          "customer_bucket"
        ],
        "driver_fields": [
          "opening_value",
          "signed_additions_value",
          "approved_variations",
          "revenue_recognized",
          "terminated_value"
        ],
        "grain": "backlog_period"
      },
      "entity_mode": "singleton",
      "failure_anti_pattern_checks": [
        "framework_relabelled_as_signed",
        "negotiation_relabelled_as_signed",
        "unreconciled_value",
        "unreconciled_count",
        "silent_probability_weighting",
        "negative_backlog",
        "loss_making_hidden",
        "concentration_hidden",
        "unknown_operator",
        "external_code",
        "hidden_plug",
        "authorization_relaxation"
      ],
      "formula_lineage": {
        "allowed_operators": [
          "add",
          "subtract"
        ],
        "nodes": [
          {
            "inputs": [
              "opening_value",
              "signed_additions_value"
            ],
            "node_id": "gross_signed_backlog",
            "operator": "add",
            "output_unit": "CU_thousand_ex_tax"
          },
          {
            "inputs": [
              "gross_signed_backlog",
              "approved_variations"
            ],
            "node_id": "post_variation_backlog",
            "operator": "add",
            "output_unit": "CU_thousand_ex_tax"
          },
          {
            "inputs": [
              "revenue_recognized",
              "terminated_value"
            ],
            "node_id": "value_reductions",
            "operator": "add",
            "output_unit": "CU_thousand_ex_tax"
          },
          {
            "inputs": [
              "post_variation_backlog",
              "value_reductions"
            ],
            "node_id": "closing_backlog_value",
            "operator": "subtract",
            "output_unit": "CU_thousand_ex_tax"
          },
          {
            "inputs": [
              "opening_count",
              "signed_additions_count"
            ],
            "node_id": "gross_project_count",
            "operator": "add",
            "output_unit": "projects"
          },
          {
            "inputs": [
              "completed_count",
              "terminated_count"
            ],
            "node_id": "count_reductions",
            "operator": "add",
            "output_unit": "projects"
          },
          {
            "inputs": [
              "gross_project_count",
              "count_reductions"
            ],
            "node_id": "closing_backlog_count",
            "operator": "subtract",
            "output_unit": "projects"
          }
        ]
      },
      "integrity": {
        "algorithm": "sha256",
        "value_location": "backlog_conversion.seed.json.sha256"
      },
      "no_company_data": {
        "attested": true,
        "statement": "This artifact contains reusable grammar only; it contains no issuer, customer, project, product or baseline value."
      },
      "output_schema": [
        "signed_roll_forward",
        "separate_visibility_buckets",
        "timing_sensitivity",
        "controls",
        "lineage",
        "model_identity"
      ],
      "provenance": {
        "archaeology_refs": [
          "ACTUAL-C-DISCLOSURE",
          "ACTUAL-C-MODEL",
          "ACTUAL-C-SESSION"
        ],
        "structural_source_sha256": [
          "6dae3ed530a0723f2904882cda5fafe637aef87f16ee2f1714d61d32d2da6e60",
          "e45692ad2fcf7328cfb9ffaa444aee67fd9b134e8412683f1c2cf8d42d3ffd1c",
          "1eff49a66773db4554164388adfa2114b7598e0343a292e78fafc35810ab85c6"
        ]
      },
      "question": "How much signed commercial work remains, how did it move, and what visibility sits outside secured backlog?",
      "required_concept_slots": [
        {
          "allowed_units": [
            "CU_thousand_ex_tax"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "opening_value",
          "required": true,
          "slot_id": "opening_value",
          "type": "number"
        },
        {
          "allowed_units": [
            "projects"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "opening_count",
          "required": true,
          "slot_id": "opening_count",
          "type": "integer"
        },
        {
          "allowed_units": [
            "CU_thousand_ex_tax"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "signed_additions_value",
          "required": true,
          "slot_id": "signed_additions_value",
          "type": "number"
        },
        {
          "allowed_units": [
            "projects"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "signed_additions_count",
          "required": true,
          "slot_id": "signed_additions_count",
          "type": "integer"
        },
        {
          "allowed_units": [
            "CU_thousand_ex_tax"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "approved_variations",
          "required": true,
          "slot_id": "approved_variations",
          "type": "number"
        },
        {
          "allowed_units": [
            "CU_thousand_ex_tax"
          ],
          "authorization": "accountant_confirmed",
          "concept_suffix": "revenue_recognized",
          "required": true,
          "slot_id": "revenue_recognized",
          "type": "number"
        },
        {
          "allowed_units": [
            "CU_thousand_ex_tax"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "terminated_value",
          "required": true,
          "slot_id": "terminated_value",
          "type": "number"
        },
        {
          "allowed_units": [
            "projects"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "completed_count",
          "required": true,
          "slot_id": "completed_count",
          "type": "integer"
        },
        {
          "allowed_units": [
            "projects"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "terminated_count",
          "required": true,
          "slot_id": "terminated_count",
          "type": "integer"
        },
        {
          "allowed_units": [
            "boolean"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "classification_policy_confirmed",
          "required": true,
          "slot_id": "classification_policy_confirmed",
          "type": "boolean"
        },
        {
          "allowed_units": [
            "CU_thousand_ex_tax"
          ],
          "authorization": "source_bound",
          "concept_suffix": "framework_value",
          "required": false,
          "slot_id": "framework_value",
          "type": "number"
        },
        {
          "allowed_units": [
            "CU_thousand_ex_tax"
          ],
          "authorization": "source_bound",
          "concept_suffix": "negotiation_pipeline_value",
          "required": false,
          "slot_id": "negotiation_pipeline_value",
          "type": "number"
        },
        {
          "allowed_units": [
            "ratio"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "framework_scenario_probability",
          "required": false,
          "slot_id": "framework_scenario_probability",
          "type": "number"
        },
        {
          "allowed_units": [
            "projects"
          ],
          "authorization": "accountant_confirmed",
          "concept_suffix": "loss_making_project_count",
          "required": false,
          "slot_id": "loss_making_project_count",
          "type": "integer"
        },
        {
          "allowed_units": [
            "ratio"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "top_customer_concentration",
          "required": false,
          "slot_id": "top_customer_concentration",
          "type": "number"
        }
      ],
      "schema": "driver-seed/v1",
      "scope_prefix": "backlog",
      "seed_id": "backlog_conversion",
      "title": "Backlog / Contract Conversion",
      "version": "1.0.0"
    },
    "project_progress": {
      "applicable_business_model_signals": [
        "project contracts",
        "over-time revenue",
        "cost input method",
        "milestones",
        "contract assets"
      ],
      "authorization_confirmation_rules": {
        "accountant": [
          "revenue_policy_confirmed",
          "cost_incurred_to_date",
          "prior_cumulative_revenue",
          "prior_cumulative_cost",
          "expected_loss_treatment"
        ],
        "banker": [
          "transaction_price",
          "expected_total_cost",
          "estimate_version",
          "milestones",
          "billings",
          "cash_collection"
        ],
        "relaxation_allowed": false
      },
      "bounds_control_policy": [
        {
          "breach": "hard_fail",
          "control_id": "PROGRESS_RANGE",
          "field": "cumulative_progress",
          "max": 1,
          "min": 0,
          "silent_clip": false
        },
        {
          "breach": "hard_fail",
          "control_id": "ETC_POSITIVE",
          "exclusive_min": 0,
          "field": "expected_total_cost"
        },
        {
          "breach": "visible_flag",
          "control_id": "ETC_REVISION_CATCH_UP",
          "fields": [
            "prior_expected_total_cost",
            "expected_total_cost"
          ]
        },
        {
          "breach": "visible_flag",
          "control_id": "NEGATIVE_CATCH_UP",
          "field": "current_period_revenue",
          "min": 0
        },
        {
          "breach": "accountant_confirmation_and_visible_flag",
          "control_id": "EXPECTED_LOSS",
          "fields": [
            "transaction_price",
            "expected_total_cost"
          ]
        }
      ],
      "driver_registry_schema": {
        "dimensions": [
          "identity",
          "period",
          "expected_total_cost_version",
          "milestone_status"
        ],
        "driver_fields": [
          "transaction_price",
          "cost_incurred_to_date",
          "expected_total_cost",
          "prior_cumulative_revenue",
          "prior_cumulative_cost",
          "cumulative_billings",
          "cumulative_cash_collected"
        ],
        "grain": "project_period"
      },
      "entity_mode": "repeated",
      "failure_anti_pattern_checks": [
        "progress_above_100_percent",
        "silent_progress_clipping",
        "missing_expected_total_cost_version",
        "negative_catch_up_hidden",
        "expected_loss_hidden",
        "billing_cash_bridge_missing",
        "unknown_operator",
        "external_code",
        "hidden_plug",
        "authorization_relaxation"
      ],
      "formula_lineage": {
        "allowed_operators": [
          "add",
          "subtract",
          "multiply",
          "divide",
          "max_zero"
        ],
        "nodes": [
          {
            "inputs": [
              "cost_incurred_to_date",
              "expected_total_cost"
            ],
            "node_id": "cumulative_progress",
            "operator": "divide",
            "output_unit": "ratio"
          },
          {
            "inputs": [
              "transaction_price",
              "cumulative_progress"
            ],
            "node_id": "cumulative_revenue",
            "operator": "multiply",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "cumulative_revenue",
              "prior_cumulative_revenue"
            ],
            "node_id": "current_period_revenue",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "cost_incurred_to_date",
              "prior_cumulative_cost"
            ],
            "node_id": "current_period_cost",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "current_period_revenue",
              "current_period_cost"
            ],
            "node_id": "project_gp",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "project_gp",
              "current_period_revenue"
            ],
            "node_id": "project_gp_margin",
            "operator": "divide",
            "output_unit": "ratio"
          },
          {
            "inputs": [
              "cumulative_billings",
              "cumulative_cash_collected"
            ],
            "node_id": "unconditional_receivable_raw",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "unconditional_receivable_raw"
            ],
            "node_id": "receivable",
            "operator": "max_zero",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "cumulative_revenue",
              "cumulative_billings"
            ],
            "node_id": "contract_asset_raw",
            "operator": "subtract",
            "output_unit": "CU_thousand"
          },
          {
            "inputs": [
              "contract_asset_raw"
            ],
            "node_id": "contract_asset",
            "operator": "max_zero",
            "output_unit": "CU_thousand"
          }
        ]
      },
      "integrity": {
        "algorithm": "sha256",
        "value_location": "project_progress.seed.json.sha256"
      },
      "no_company_data": {
        "attested": true,
        "statement": "This artifact contains reusable grammar only; it contains no issuer, customer, project, product or baseline value."
      },
      "output_schema": [
        "project_rows",
        "period_aggregate",
        "lineage",
        "controls",
        "sensitivities",
        "model_identity"
      ],
      "provenance": {
        "archaeology_refs": [
          "ACTUAL-A-WORKBOOK",
          "ACTUAL-A-DISCLOSURE",
          "ACTUAL-A-QA"
        ],
        "structural_source_sha256": [
          "6dae3ed530a0723f2904882cda5fafe637aef87f16ee2f1714d61d32d2da6e60",
          "e45692ad2fcf7328cfb9ffaa444aee67fd9b134e8412683f1c2cf8d42d3ffd1c",
          "cb62da7f43389a96ac9bea442a01f2164ea6daaf31de602d526b155c89750d87",
          "688b6cd14ddb4f1c155ed07b2cfdafac93f8fe46c9c2fd2a6f085f56f9f03b73"
        ]
      },
      "question": "How much project revenue, cost, gross profit and working-capital exposure follows from approved progress evidence?",
      "required_concept_slots": [
        {
          "allowed_units": [
            "id"
          ],
          "authorization": "source_bound",
          "concept_suffix": "identity",
          "required": true,
          "slot_id": "identity",
          "type": "string"
        },
        {
          "allowed_units": [
            "CU_thousand_ex_tax"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "transaction_price",
          "required": true,
          "slot_id": "transaction_price",
          "type": "number"
        },
        {
          "allowed_units": [
            "CU_thousand"
          ],
          "authorization": "accountant_confirmed",
          "concept_suffix": "cost_incurred_to_date",
          "required": true,
          "slot_id": "cost_incurred_to_date",
          "type": "number"
        },
        {
          "allowed_units": [
            "CU_thousand"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "expected_total_cost",
          "required": true,
          "slot_id": "expected_total_cost",
          "type": "number"
        },
        {
          "allowed_units": [
            "version"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "expected_total_cost_version",
          "required": true,
          "slot_id": "expected_total_cost_version",
          "type": "string"
        },
        {
          "allowed_units": [
            "CU_thousand"
          ],
          "authorization": "source_bound",
          "concept_suffix": "prior_expected_total_cost",
          "required": true,
          "slot_id": "prior_expected_total_cost",
          "type": "number"
        },
        {
          "allowed_units": [
            "CU_thousand"
          ],
          "authorization": "accountant_confirmed",
          "concept_suffix": "prior_cumulative_revenue",
          "required": true,
          "slot_id": "prior_cumulative_revenue",
          "type": "number"
        },
        {
          "allowed_units": [
            "CU_thousand"
          ],
          "authorization": "accountant_confirmed",
          "concept_suffix": "prior_cumulative_cost",
          "required": true,
          "slot_id": "prior_cumulative_cost",
          "type": "number"
        },
        {
          "allowed_units": [
            "CU_thousand"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "cumulative_billings",
          "required": true,
          "slot_id": "cumulative_billings",
          "type": "number"
        },
        {
          "allowed_units": [
            "CU_thousand"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "cumulative_cash_collected",
          "required": true,
          "slot_id": "cumulative_cash_collected",
          "type": "number"
        },
        {
          "allowed_units": [
            "boolean"
          ],
          "authorization": "accountant_confirmed",
          "concept_suffix": "revenue_policy_confirmed",
          "required": true,
          "slot_id": "revenue_policy_confirmed",
          "type": "boolean"
        },
        {
          "allowed_units": [
            "status"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "milestone_status",
          "required": true,
          "slot_id": "milestone_status",
          "type": "string"
        },
        {
          "allowed_units": [
            "ratio"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "cumulative_progress_reported",
          "required": false,
          "slot_id": "cumulative_progress_reported",
          "type": "number"
        }
      ],
      "schema": "driver-seed/v1",
      "scope_prefix": "project",
      "seed_id": "project_progress",
      "title": "Project Progress / Cost-to-complete",
      "version": "1.0.0"
    },
    "volume_asp_channel": {
      "applicable_business_model_signals": [
        "product models",
        "monthly quantity",
        "ASP or RRP",
        "region",
        "online/offline",
        "FX",
        "unit cost",
        "new-product ramp"
      ],
      "authorization_confirmation_rules": {
        "accountant": [
          "unit_cost_local"
        ],
        "banker": [
          "quantity",
          "asp_local",
          "fx",
          "discount",
          "add_on_ratios",
          "mapping",
          "capacity",
          "channel_orders"
        ],
        "relaxation_allowed": false
      },
      "bounds_control_policy": [
        {
          "breach": "hard_fail",
          "control_id": "QUANTITY_NON_NEGATIVE",
          "field": "quantity",
          "min": 0
        },
        {
          "breach": "hard_fail",
          "control_id": "RATIO_RANGE",
          "fields": [
            "discount_rate",
            "freight_ratio",
            "accessories_ratio",
            "brand_material_ratio",
            "service_ratio"
          ],
          "max": 1,
          "min": 0
        },
        {
          "breach": "hard_fail",
          "control_id": "FX_POSITIVE",
          "exclusive_min": 0,
          "field": "fx_to_reporting"
        },
        {
          "breach": "blocked_until_banker_confirmed",
          "control_id": "MODEL_MAPPING",
          "field": "model_mapping_confirmed"
        },
        {
          "breach": "blocked_until_banker_confirmed",
          "control_id": "NEW_PRODUCT_RAMP",
          "fields": [
            "new_product_flag",
            "capacity_confirmed",
            "channel_confirmed"
          ]
        },
        {
          "breach": "hard_fail",
          "control_id": "ROLLUP_RECONCILIATION",
          "fields": [
            "model",
            "region",
            "channel",
            "month",
            "total_revenue",
            "product_cost"
          ]
        }
      ],
      "driver_registry_schema": {
        "dimensions": [
          "model",
          "reporting_line",
          "region",
          "channel",
          "month"
        ],
        "driver_fields": [
          "quantity",
          "asp_local",
          "fx_to_reporting",
          "unit_cost_local",
          "discount_rate",
          "freight_ratio",
          "accessories_ratio",
          "brand_material_ratio",
          "service_ratio"
        ],
        "grain": "model_region_channel_month"
      },
      "entity_mode": "repeated",
      "failure_anti_pattern_checks": [
        "wrong_unit",
        "missing_fx",
        "unconfirmed_mapping",
        "unconfirmed_new_product_ramp",
        "rollup_mismatch",
        "hidden_add_on_plug",
        "unknown_operator",
        "external_code",
        "hidden_plug",
        "authorization_relaxation"
      ],
      "formula_lineage": {
        "allowed_operators": [
          "add",
          "subtract",
          "multiply",
          "divide",
          "one_minus"
        ],
        "nodes": [
          {
            "inputs": [
              "quantity",
              "asp_local"
            ],
            "node_id": "gross_sales_local",
            "operator": "multiply",
            "output_unit": "LC"
          },
          {
            "inputs": [
              "discount_rate"
            ],
            "node_id": "discount_factor",
            "operator": "one_minus",
            "output_unit": "ratio"
          },
          {
            "inputs": [
              "gross_sales_local",
              "discount_factor"
            ],
            "node_id": "net_product_revenue_local",
            "operator": "multiply",
            "output_unit": "LC"
          },
          {
            "inputs": [
              "net_product_revenue_local",
              "fx_to_reporting"
            ],
            "node_id": "net_product_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "freight_ratio"
            ],
            "node_id": "freight_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "accessories_ratio"
            ],
            "node_id": "accessories_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "brand_material_ratio"
            ],
            "node_id": "brand_material_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "service_ratio"
            ],
            "node_id": "service_revenue",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "net_product_revenue",
              "freight_revenue"
            ],
            "node_id": "revenue_with_freight",
            "operator": "add",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "revenue_with_freight",
              "accessories_revenue"
            ],
            "node_id": "revenue_with_accessories",
            "operator": "add",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "revenue_with_accessories",
              "brand_material_revenue"
            ],
            "node_id": "revenue_with_brand",
            "operator": "add",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "revenue_with_brand",
              "service_revenue"
            ],
            "node_id": "total_revenue",
            "operator": "add",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "quantity",
              "unit_cost_local"
            ],
            "node_id": "product_cost_local",
            "operator": "multiply",
            "output_unit": "LC"
          },
          {
            "inputs": [
              "product_cost_local",
              "fx_to_reporting"
            ],
            "node_id": "product_cost",
            "operator": "multiply",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "total_revenue",
              "product_cost"
            ],
            "node_id": "gross_profit",
            "operator": "subtract",
            "output_unit": "RC"
          },
          {
            "inputs": [
              "gross_profit",
              "total_revenue"
            ],
            "node_id": "gross_margin",
            "operator": "divide",
            "output_unit": "ratio"
          }
        ]
      },
      "integrity": {
        "algorithm": "sha256",
        "value_location": "volume_asp_channel.seed.json.sha256"
      },
      "no_company_data": {
        "attested": true,
        "statement": "This artifact contains reusable grammar only; it contains no issuer, customer, project, product or baseline value."
      },
      "output_schema": [
        "row_calculations",
        "model_rollup",
        "region_channel_rollup",
        "group_rollup",
        "controls",
        "lineage",
        "sensitivities",
        "model_identity"
      ],
      "provenance": {
        "archaeology_refs": [
          "ACTUAL-B-WORKBOOK"
        ],
        "structural_source_sha256": [
          "f5dfb9fd48c724b1f026fa9ce99e2533d22755a49f5d8f113f9ee8b4af5d6c39"
        ]
      },
      "question": "What revenue and gross profit follow from monthly product quantity, price, channel, geography, FX and unit cost?",
      "required_concept_slots": [
        {
          "allowed_units": [
            "model"
          ],
          "authorization": "source_bound",
          "concept_suffix": "model",
          "required": true,
          "slot_id": "model",
          "type": "string"
        },
        {
          "allowed_units": [
            "line"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "reporting_line",
          "required": true,
          "slot_id": "reporting_line",
          "type": "string"
        },
        {
          "allowed_units": [
            "region"
          ],
          "authorization": "source_bound",
          "concept_suffix": "region",
          "required": true,
          "slot_id": "region",
          "type": "string"
        },
        {
          "allowed_units": [
            "channel"
          ],
          "authorization": "source_bound",
          "concept_suffix": "channel",
          "required": true,
          "slot_id": "channel",
          "type": "string"
        },
        {
          "allowed_units": [
            "month"
          ],
          "authorization": "source_bound",
          "concept_suffix": "month",
          "required": true,
          "slot_id": "month",
          "type": "string"
        },
        {
          "allowed_units": [
            "units"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "quantity",
          "required": true,
          "slot_id": "quantity",
          "type": "number"
        },
        {
          "allowed_units": [
            "LC_per_unit"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "asp_local",
          "required": true,
          "slot_id": "asp_local",
          "type": "number"
        },
        {
          "allowed_units": [
            "RC_per_LC"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "fx_to_reporting",
          "required": true,
          "slot_id": "fx_to_reporting",
          "type": "number"
        },
        {
          "allowed_units": [
            "LC_per_unit"
          ],
          "authorization": "accountant_confirmed",
          "concept_suffix": "unit_cost_local",
          "required": true,
          "slot_id": "unit_cost_local",
          "type": "number"
        },
        {
          "allowed_units": [
            "ratio"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "discount_rate",
          "required": true,
          "slot_id": "discount_rate",
          "type": "number"
        },
        {
          "allowed_units": [
            "ratio"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "freight_ratio",
          "required": true,
          "slot_id": "freight_ratio",
          "type": "number"
        },
        {
          "allowed_units": [
            "ratio"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "accessories_ratio",
          "required": true,
          "slot_id": "accessories_ratio",
          "type": "number"
        },
        {
          "allowed_units": [
            "ratio"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "brand_material_ratio",
          "required": true,
          "slot_id": "brand_material_ratio",
          "type": "number"
        },
        {
          "allowed_units": [
            "ratio"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "service_ratio",
          "required": true,
          "slot_id": "service_ratio",
          "type": "number"
        },
        {
          "allowed_units": [
            "boolean"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "model_mapping_confirmed",
          "required": true,
          "slot_id": "model_mapping_confirmed",
          "type": "boolean"
        },
        {
          "allowed_units": [
            "boolean"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "capacity_confirmed",
          "required": true,
          "slot_id": "capacity_confirmed",
          "type": "boolean"
        },
        {
          "allowed_units": [
            "boolean"
          ],
          "authorization": "banker_confirmed",
          "concept_suffix": "channel_confirmed",
          "required": true,
          "slot_id": "channel_confirmed",
          "type": "boolean"
        },
        {
          "allowed_units": [
            "boolean"
          ],
          "authorization": "source_bound",
          "concept_suffix": "new_product_flag",
          "required": true,
          "slot_id": "new_product_flag",
          "type": "boolean"
        }
      ],
      "schema": "driver-seed/v1",
      "scope_prefix": "product",
      "seed_id": "volume_asp_channel",
      "title": "Volume × ASP / Product × Region × Channel",
      "version": "1.0.0"
    }
  },
  "ssot": {
    "as_of": "2026-06-30",
    "attestation": "Fully synthetic anonymous composite; no historical issuer data.",
    "classification": "SYNTHETIC_TRAINING_ONLY",
    "currency_convention": {
      "CU": "synthetic currency unit",
      "LC": "synthetic local currency",
      "RC": "synthetic reporting currency"
    },
    "immutability_policy": "Seeds read this snapshot; no seed may mutate it.",
    "records": {
      "backlog.approved_variations": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand_ex_tax",
        "value": 300
      },
      "backlog.classification_policy_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "BCH-4.2",
        "requires_confirmation": true,
        "source_document_id": "SYN-BCH-001",
        "source_rank": 2,
        "source_type": "business_chapter",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "backlog.completed_count": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "projects",
        "value": 1
      },
      "backlog.framework_scenario_probability": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "low",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-H2",
        "reference": "MGT-2.1",
        "requires_confirmation": true,
        "source_document_id": "SYN-MGT-001",
        "source_rank": 3,
        "source_type": "management_discussion",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "ratio",
        "value": 0.6
      },
      "backlog.framework_value": {
        "authorized_for_binding": true,
        "classification": "framework_only",
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H2",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand_ex_tax",
        "value": 9000
      },
      "backlog.loss_making_project_count": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "projects",
        "value": 1
      },
      "backlog.negotiation_pipeline_value": {
        "authorized_for_binding": true,
        "classification": "negotiation_stage",
        "confidence": "medium",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H2",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand_ex_tax",
        "value": 4000
      },
      "backlog.opening_count": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "projects",
        "value": 3
      },
      "backlog.opening_value": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand_ex_tax",
        "value": 12000
      },
      "backlog.revenue_recognized": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand_ex_tax",
        "value": 4200
      },
      "backlog.signed_additions_count": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "projects",
        "value": 2
      },
      "backlog.signed_additions_value": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand_ex_tax",
        "value": 5000
      },
      "backlog.terminated_count": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "projects",
        "value": 0
      },
      "backlog.terminated_value": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand_ex_tax",
        "value": 0
      },
      "backlog.top_customer_concentration": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-H1",
        "reference": "OPS-BACKLOG-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.38
      },
      "business.has_product_distribution": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "current",
        "reference": "BCH-2.1",
        "requires_confirmation": false,
        "source_document_id": "SYN-BCH-001",
        "source_rank": 2,
        "source_type": "business_chapter",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "business.has_project_solutions": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "current",
        "reference": "BCH-2.1",
        "requires_confirmation": false,
        "source_document_id": "SYN-BCH-001",
        "source_rank": 2,
        "source_type": "business_chapter",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "business.online_payment_days": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": true,
        "period": "2026",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND_WITH_CONFLICT",
        "unit": "days",
        "value": 40
      },
      "business.product_addon_policy": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026",
        "reference": "BCH-5.6",
        "requires_confirmation": false,
        "source_document_id": "SYN-BCH-001",
        "source_rank": 2,
        "source_type": "business_chapter",
        "state": "BOUND",
        "unit": "method",
        "value": "explicit_ratios"
      },
      "business.product_driver_method": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026",
        "reference": "BCH-5.3",
        "requires_confirmation": false,
        "source_document_id": "SYN-BCH-001",
        "source_rank": 2,
        "source_type": "business_chapter",
        "state": "BOUND",
        "unit": "method",
        "value": "quantity_x_net_asp"
      },
      "product.ROW-01.accessories_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.015
      },
      "product.ROW-01.asp_local": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "LC_per_unit",
        "value": 1200
      },
      "product.ROW-01.brand_material_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.005
      },
      "product.ROW-01.capacity_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-01.channel": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "channel",
        "value": "online"
      },
      "product.ROW-01.channel_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-01.discount_rate": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.08
      },
      "product.ROW-01.freight_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.02
      },
      "product.ROW-01.fx_to_reporting": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "RC_per_LC",
        "value": 0.85
      },
      "product.ROW-01.model": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "model",
        "value": "MODEL-ALPHA"
      },
      "product.ROW-01.model_mapping_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-01.month": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "month",
        "value": "2026-07"
      },
      "product.ROW-01.new_product_flag": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": false
      },
      "product.ROW-01.quantity": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "units",
        "value": 1000
      },
      "product.ROW-01.region": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "region",
        "value": "REGION-NORTH"
      },
      "product.ROW-01.reporting_line": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "line",
        "value": "LINE-CORE"
      },
      "product.ROW-01.service_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.01
      },
      "product.ROW-01.unit_cost_local": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "LC_per_unit",
        "value": 720
      },
      "product.ROW-02.accessories_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.02
      },
      "product.ROW-02.asp_local": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "LC_per_unit",
        "value": 1600
      },
      "product.ROW-02.brand_material_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.006
      },
      "product.ROW-02.capacity_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-02.channel": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "channel",
        "value": "offline"
      },
      "product.ROW-02.channel_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-02.discount_rate": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.12
      },
      "product.ROW-02.freight_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.025
      },
      "product.ROW-02.fx_to_reporting": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "RC_per_LC",
        "value": 0.85
      },
      "product.ROW-02.model": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "model",
        "value": "MODEL-BETA"
      },
      "product.ROW-02.model_mapping_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-02.month": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "month",
        "value": "2026-07"
      },
      "product.ROW-02.new_product_flag": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": false
      },
      "product.ROW-02.quantity": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "units",
        "value": 700
      },
      "product.ROW-02.region": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "region",
        "value": "REGION-SOUTH"
      },
      "product.ROW-02.reporting_line": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "line",
        "value": "LINE-PLUS"
      },
      "product.ROW-02.service_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.012
      },
      "product.ROW-02.unit_cost_local": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-07",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "LC_per_unit",
        "value": 980
      },
      "product.ROW-03.accessories_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.015
      },
      "product.ROW-03.asp_local": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "LC_per_unit",
        "value": 1180
      },
      "product.ROW-03.brand_material_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.005
      },
      "product.ROW-03.capacity_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-03.channel": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "channel",
        "value": "offline"
      },
      "product.ROW-03.channel_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-03.discount_rate": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.09
      },
      "product.ROW-03.freight_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.02
      },
      "product.ROW-03.fx_to_reporting": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "RC_per_LC",
        "value": 0.86
      },
      "product.ROW-03.model": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "model",
        "value": "MODEL-ALPHA"
      },
      "product.ROW-03.model_mapping_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-03.month": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "month",
        "value": "2026-08"
      },
      "product.ROW-03.new_product_flag": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": false
      },
      "product.ROW-03.quantity": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "units",
        "value": 900
      },
      "product.ROW-03.region": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "region",
        "value": "REGION-NORTH"
      },
      "product.ROW-03.reporting_line": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "line",
        "value": "LINE-CORE"
      },
      "product.ROW-03.service_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.01
      },
      "product.ROW-03.unit_cost_local": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "LC_per_unit",
        "value": 710
      },
      "product.ROW-04.accessories_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.02
      },
      "product.ROW-04.asp_local": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "LC_per_unit",
        "value": 1580
      },
      "product.ROW-04.brand_material_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.006
      },
      "product.ROW-04.capacity_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-04.channel": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "channel",
        "value": "online"
      },
      "product.ROW-04.channel_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-04.discount_rate": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.11
      },
      "product.ROW-04.freight_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.025
      },
      "product.ROW-04.fx_to_reporting": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "RC_per_LC",
        "value": 0.86
      },
      "product.ROW-04.model": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "model",
        "value": "MODEL-BETA"
      },
      "product.ROW-04.model_mapping_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-04.month": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "month",
        "value": "2026-08"
      },
      "product.ROW-04.new_product_flag": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": false
      },
      "product.ROW-04.quantity": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "units",
        "value": 650
      },
      "product.ROW-04.region": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "region",
        "value": "REGION-SOUTH"
      },
      "product.ROW-04.reporting_line": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "line",
        "value": "LINE-PLUS"
      },
      "product.ROW-04.service_ratio": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.012
      },
      "product.ROW-04.unit_cost_local": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "LC_per_unit",
        "value": 970
      },
      "product.ROW-NP1.accessories_ratio": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "ratio",
        "value": 0.015
      },
      "product.ROW-NP1.asp_local": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "low",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "LC_per_unit",
        "value": 1900
      },
      "product.ROW-NP1.brand_material_ratio": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "ratio",
        "value": 0.005
      },
      "product.ROW-NP1.capacity_confirmed": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "boolean",
        "value": false
      },
      "product.ROW-NP1.channel": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "channel",
        "value": "online"
      },
      "product.ROW-NP1.channel_confirmed": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "boolean",
        "value": false
      },
      "product.ROW-NP1.discount_rate": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "low",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "ratio",
        "value": 0.1
      },
      "product.ROW-NP1.freight_ratio": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "ratio",
        "value": 0.02
      },
      "product.ROW-NP1.fx_to_reporting": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "RC_per_LC",
        "value": 0.86
      },
      "product.ROW-NP1.model": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "model",
        "value": "MODEL-GAMMA"
      },
      "product.ROW-NP1.model_mapping_confirmed": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "boolean",
        "value": false
      },
      "product.ROW-NP1.month": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "month",
        "value": "2026-08"
      },
      "product.ROW-NP1.new_product_flag": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "product.ROW-NP1.quantity": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "low",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "units",
        "value": 500
      },
      "product.ROW-NP1.region": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "region",
        "value": "REGION-NORTH"
      },
      "product.ROW-NP1.reporting_line": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "line",
        "value": "LINE-NEW"
      },
      "product.ROW-NP1.service_ratio": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "medium",
        "confirmation_owner": "banker",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "ratio",
        "value": 0.01
      },
      "product.ROW-NP1.unit_cost_local": {
        "authorized_for_binding": false,
        "classification": null,
        "confidence": "low",
        "confirmation_owner": "accountant",
        "confirmed": false,
        "has_conflict": false,
        "period": "2026-08",
        "reference": "OPS-PRODUCT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BLOCKED_CONFIRMATION",
        "unit": "LC_per_unit",
        "value": 1250
      },
      "project.PRJ-A1.cost_incurred_to_date": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 4800
      },
      "project.PRJ-A1.cumulative_billings": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 5700
      },
      "project.PRJ-A1.cumulative_cash_collected": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 5200
      },
      "project.PRJ-A1.cumulative_progress_reported": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": true,
        "period": "2026-06",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND_WITH_CONFLICT",
        "unit": "ratio",
        "value": 0.8
      },
      "project.PRJ-A1.expected_total_cost": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 6000
      },
      "project.PRJ-A1.expected_total_cost_version": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "version",
        "value": "ETC-2026-06-v2"
      },
      "project.PRJ-A1.identity": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "id",
        "value": "PRJ-A1"
      },
      "project.PRJ-A1.milestone_status": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "status",
        "value": "installation_active"
      },
      "project.PRJ-A1.prior_cumulative_cost": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-05",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 4500
      },
      "project.PRJ-A1.prior_cumulative_revenue": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-05",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 5400
      },
      "project.PRJ-A1.prior_expected_total_cost": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-05",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 6250
      },
      "project.PRJ-A1.revenue_policy_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "BCH-3.4",
        "requires_confirmation": true,
        "source_document_id": "SYN-BCH-001",
        "source_rank": 2,
        "source_type": "business_chapter",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "project.PRJ-A1.transaction_price": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-01",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand_ex_tax",
        "value": 7500
      },
      "project.PRJ-B2.cost_incurred_to_date": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 1980
      },
      "project.PRJ-B2.cumulative_billings": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 1600
      },
      "project.PRJ-B2.cumulative_cash_collected": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 1250
      },
      "project.PRJ-B2.cumulative_progress_reported": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "ratio",
        "value": 0.6
      },
      "project.PRJ-B2.expected_total_cost": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 3300
      },
      "project.PRJ-B2.expected_total_cost_version": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "version",
        "value": "ETC-2026-06-v3"
      },
      "project.PRJ-B2.identity": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "id",
        "value": "PRJ-B2"
      },
      "project.PRJ-B2.milestone_status": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "status",
        "value": "commissioning"
      },
      "project.PRJ-B2.prior_cumulative_cost": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-05",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 1500
      },
      "project.PRJ-B2.prior_cumulative_revenue": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-05",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 1450
      },
      "project.PRJ-B2.prior_expected_total_cost": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": null,
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-05",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": false,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand",
        "value": 3100
      },
      "project.PRJ-B2.revenue_policy_confirmed": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "accountant",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "BCH-3.4",
        "requires_confirmation": true,
        "source_document_id": "SYN-BCH-001",
        "source_rank": 2,
        "source_type": "business_chapter",
        "state": "BOUND",
        "unit": "boolean",
        "value": true
      },
      "project.PRJ-B2.transaction_price": {
        "authorized_for_binding": true,
        "classification": null,
        "confidence": "high",
        "confirmation_owner": "banker",
        "confirmed": true,
        "has_conflict": false,
        "period": "2026-06",
        "reference": "OPS-PROJECT-02",
        "requires_confirmation": true,
        "source_document_id": "SYN-OPS-001",
        "source_rank": 1,
        "source_type": "operating_schedule",
        "state": "BOUND",
        "unit": "CU_thousand_ex_tax",
        "value": 3000
      }
    },
    "schema": "financial-operating-ssot/v1"
  }
};
