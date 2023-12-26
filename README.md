# Operations Management in IT course

This repository uses [Terraform](https://www.terraform.io/) to set up Google Cloud for the Columbia University's [Operations Management in IT](https://doc.sis.columbia.edu/#subj/TMGT/PS5120-20241-001/) course. Using a list of student IDs (UNIs), it provisions [Projects](https://cloud.google.com/docs/overview#projects) for each, granting access to the instructor and Associates (a.k.a. teaching assistants).

## Setup

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
