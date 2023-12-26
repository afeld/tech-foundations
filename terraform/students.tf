locals {
  students = csvdecode(file("${path.module}/students.csv"))
  unis     = toset([for student in local.students : student.UNI])
}

module "students" {
  source = "./student"

  for_each = local.unis

  org_id         = data.google_project.project.org_id
  uni            = each.key
  email_override = "aidan.feldman@gmail.com"
}

module "test_student" {
  source = "./student"

  org_id         = data.google_project.project.org_id
  uni            = "teststudent"
  email_override = "aidan.feldman@gmail.com"
}
