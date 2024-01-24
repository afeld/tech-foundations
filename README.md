# Operations Management in IT course

This repository uses [Terraform](https://www.terraform.io/) to set up Google Cloud for the Columbia University's [Operations Management in IT](https://doc.sis.columbia.edu/#subj/TMGT/PS5120-20241-001/) course. Using a list of student and instructor IDs ([UNIs](https://www.cuit.columbia.edu/my-uni)), it provisions [Projects](https://cloud.google.com/docs/overview#projects) for each, granting access to the instructor and Associates (a.k.a. teaching assistants) via [IAM](https://cloud.google.com/security/products/iam).

## Course setup

This only needs to be done once per semester, by whichever instructor is managing Google Cloud.

1. If the number of students+instructors is larger than 20, [request a Project Quota increase](https://support.google.com/code/contact/project_quota_increase)
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
1. Run `terraform apply -parallelism=400` (arbitrarily high number)

As the course enrollment changes, re-run the last two steps.

As students go through the setup (below), you can re-run the `apply` to get a report of who is missing billing.

## Student setup

Do these one-time setup steps to ensure you don't have to pay for Google Cloud use for this class. Credits are provided through the [Google Cloud for Education](https://cloud.google.com/edu/faculty) program.

A [Project](https://cloud.google.com/docs/overview#projects) has been created for you, which the instructors have access to for troubleshooting. You redeem the credits, which creates a Billing Account. You then have to associate that Billing Account with the existing Project.

1. [Redeem the credits](https://cloud.google.com/billing/docs/how-to/edu-grants#redeem) - [video walkthrough](https://www.youtube.com/watch?v=2AnX7BX-qew)
   1. Instructor will send the coupon retrieval link
   1. Fill in the form
      - Use your UNI for your email, not an [alias](https://www.cuit.columbia.edu/email/email-aliases)
   1. When you get to [the GCP Credit Application screen](https://console.cloud.google.com/education), **make sure you've [switched to your Columbia Google account](https://support.google.com/docs/answer/2405894)**
1. [Dismiss the Free Trial banner — should not need a credit card](https://services.google.com/fh/files/helpcenter/cloud_edu_free_trial_warning.pdf)
1. Confirm the credits were applied
   1. Go to [the Billing Accounts page](https://console.cloud.google.com/billing?organizationId=819335046878)
   1. Click `Billing Account for Education`
   1. In the sidebar, click `Credits`
   1. You should see an `Operations Management in IT` credit for $50
1. Switch to your Project
   1. In the top navigation bar, on the left side, click the drop-down
   1. You should see a `Select a resource` modal pop up
   1. Click the `ALL` tab
   1. Click `Ops Mgmt in IT - <your UNI>`
1. [Change the Billing Account](https://cloud.google.com/billing/docs/how-to/modify-project#how-to-change-ba) to `Billing Account for Education`

### Accidentally redeemed the credit with the wrong Google account

If you missed the step above about switching to your Columbia Google account, the easiest fix is to follow [these steps](https://cloud.google.com/billing/docs/how-to/grant-access-to-billing#update-cloud-billing-permissions) and make your `<uni>@columbia.edu` user a `Billing Account Administrator` on the `Billing Account for Education`.

### Use of Google Cloud outside this class

If you're using Google Cloud for something outside of this class, we suggest [creating a separate Project](https://cloud.google.com/resource-manager/docs/creating-managing-projects) to keep things isolated. The `Billing Account for Education` is yours, so you're welcome to [associate it with other Projects](https://cloud.google.com/billing/docs/how-to/modify-project#how-to-change-ba) to use those credits.

We won't use the full $50 credit for this class, so you're welcome to take advantage of the remainder for other things. If you use it up, you'll start spending against your [Free Trial](https://cloud.google.com/free). Beyond that, you'll have to [pay](https://cloud.google.com/billing/docs/how-to/payment-methods).

## Troubleshooting students

Instructors should have access to all student Projects. In the selector in the top of the nav bar, switch to their Project; the name ends with their UNI.

### Audit Logs

To help figure out what went wrong, it may be helpful to see what actions a student performed.

1. [Go to Logs Explorer](https://console.cloud.google.com/logs/query;query=protoPayload.authenticationInfo.principalEmail!%3D%22alf2215@columbia.edu%22;duration=P7D)
1. Run a query with `protoPayload.authenticationInfo.principalEmail!="alf2215@columbia.edu"` to filter out setup calls made from this repository

[Info about Cloud Audit Logs](https://cloud.google.com/logging/docs/audit)
