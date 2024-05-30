locals {
  students    = csvdecode(file("${path.module}/students.csv"))
  instructors = ["alf2215"]
  unis        = setunion([for student in local.students : student.Uni], local.instructors)
  # CUIT doesn't want the projects to exist under the columbia.edu Google Cloud organization, which they manage
  folder_id = null
}

module "students" {
  source = "./student"

  for_each = local.unis

  folder_id = local.folder_id
  uni       = each.key
}

module "test_student" {
  source = "./student"

  folder_id      = local.folder_id
  uni            = "teststudent"
  email_override = "aidan.feldman@gmail.com"
}

# reporting on billing accounts

# output "billing_accounts" {
#   value = {
#     for uni, student in module.students : uni => student.billing_account
#   }
# }

locals {
  num_projects = length(module.students)
  unis_without_billing_account = compact([for uni, student in module.students : student.billing_account == null ? uni : null
  ])
}

output "unis_without_billing_account" {
  value = local.unis_without_billing_account
}

output "fraction_with_billing_accounts" {
  value = 1 - length(local.unis_without_billing_account) / local.num_projects
}
