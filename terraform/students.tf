locals {
  students = csvdecode(file("${path.module}/students.csv"))
  unis     = toset([for student in local.students : student.Uni])
}

module "students" {
  source = "./student"

  for_each = local.unis

  org_id = data.google_project.root_project.org_id
  uni    = each.key
}

module "test_student" {
  source = "./student"

  org_id         = data.google_project.root_project.org_id
  uni            = "teststudent"
  email_override = "aidan.feldman@gmail.com"
}
