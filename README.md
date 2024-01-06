# Operations Management in IT course

This repository uses [Terraform](https://www.terraform.io/) to set up Google Cloud for the Columbia University's [Operations Management in IT](https://doc.sis.columbia.edu/#subj/TMGT/PS5120-20241-001/) course. Using a list of student IDs (UNIs), it provisions [Projects](https://cloud.google.com/docs/overview#projects) for each, granting access to the instructor and Associates (a.k.a. teaching assistants).

Using credits through the [Google Cloud for Education](https://cloud.google.com/edu/faculty) program, students will:

1. Redeem their credits (information sent through the instructor)
1. [Set the billing account](https://cloud.google.com/billing/docs/how-to/modify-project#how-to-change-ba)

## Instructor setup

1. [Install Terraform](https://developer.hashicorp.com/terraform/install)
1. Set up `gcloud`:

   ```sh
   gcloud auth application-default login
   gcloud config set project columbia-sps-tech-foundations
   gcloud auth application-default set-quota-project columbia-sps-tech-foundations
   ```

1. Download the student list
   1. Go to the [SSOL](https://ssol.columbia.edu/)
   1. Click `Class List`
   1. Click `See Roster`
   1. Click `Download comma delimited roster with Excel extension.`
   1. Move to `terraform/students.csv`
1. Run `terraform apply`

## Student setup

Do these one-time setup steps to ensure you don't have to pay for Google Cloud use for this class. A [Google Cloud Project](https://cloud.google.com/docs/overview#projects) has been created for you, which the instructors have access to for troubleshooting.

1. [Redeem the credits](https://cloud.google.com/billing/docs/how-to/edu-grants#redeem) - [video walkthrough](https://www.youtube.com/watch?v=2AnX7BX-qew)
   1. Instructor will send the coupon retrieval link
   1. Fill in the form
      - Use your UNI for your email, not an [alias](https://www.cuit.columbia.edu/email/email-aliases)
   1. When you get to [the GCP Credit Application screen](https://console.cloud.google.com/education), make sure you've [switched to your Columbia Google account](https://support.google.com/docs/answer/2405894)
1. [Dismiss the Free Trial banner — should not need a credit card](https://services.google.com/fh/files/helpcenter/cloud_edu_free_trial_warning.pdf)
1. Confirm the credits were applied
   1. Go to [the Billing Accounts page](https://console.cloud.google.com/billing?organizationId=819335046878)
   1. Click `Billing Account for Education`
   1. In the sidebar, click `Credits`
   1. You should see an `Operations Management in IT` credit for $100
1. Switch to your Project
   1. In the top navigation bar, on the left side, click the drop-down
   1. You should see a `Select a resource` modal pop up
   1. Click the `ALL` tab
   1. Click `Ops Mgmt in IT - <your UNI>`
1. [Change the Billing Account](https://cloud.google.com/billing/docs/how-to/modify-project#how-to-change-ba) to `Billing Account for Education`
