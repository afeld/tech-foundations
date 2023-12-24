data "google_billing_account" "acct" {
  display_name = "Billing Account for Education"
  open         = true

  depends_on = [
    google_project_service.default["cloudbilling.googleapis.com"]
  ]
}

resource "google_billing_budget" "budget" {
  # data.google_project.project.billing_account is null for some reason, so have to retrieve the billing account above
  billing_account = data.google_billing_account.acct.id
  display_name    = "Credit Monitoring"

  amount {
    specified_amount {
      # https://cloud.google.com/edu/faculty
      currency_code = "USD"
      units         = "100"
    }
  }

  threshold_rules {
    threshold_percent = 0.5
  }
  threshold_rules {
    threshold_percent = 0.9
  }

  budget_filter {
    credit_types_treatment = "EXCLUDE_ALL_CREDITS"

    custom_period {
      start_date {
        year  = "2023"
        month = "12"
        day   = "01"
      }
      end_date {
        year  = "2024"
        month = "06"
        day   = "01"
      }
    }
  }

  depends_on = [
    google_project_service.default["billingbudgets.googleapis.com"],
    google_project_service.default["cloudresourcemanager.googleapis.com"],
    google_project_service.default["serviceusage.googleapis.com"],
  ]
}
