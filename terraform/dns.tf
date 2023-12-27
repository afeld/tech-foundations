resource "google_dns_managed_zone" "main" {
  name     = "course"
  dns_name = "tech-foundations.sps.columbia.edu."

  depends_on = [google_project_service.default["dns.googleapis.com"]]
}

output "name_servers" {
  description = "Used for zone delegation: https://cloud.google.com/dns/docs/update-name-servers"
  value       = google_dns_managed_zone.main.name_servers
}
