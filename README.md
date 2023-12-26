# Operations Management in IT course

## Setup

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
