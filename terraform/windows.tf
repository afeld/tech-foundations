# https://cloud.google.com/architecture/chrome-desktop-remote-windows-compute-engine

resource "google_compute_instance" "windows" {
  name           = "windows"
  machine_type   = "e2-small"
  enable_display = true

  # arbitrary
  zone = "${local.region}-c"

  boot_disk {
    auto_delete = true

    initialize_params {
      image = "projects/windows-cloud/global/images/windows-server-2022-dc-v20240111"
      size  = 50
      type  = "pd-standard"
    }
  }

  network_interface {
    network = "default"

    # enable public IP
    access_config {}
  }

  scheduling {
    on_host_maintenance = "MIGRATE"
  }

  lifecycle {
    # gets set for the default user
    ignore_changes = [metadata]
  }

  depends_on = [google_project_service.default["compute.googleapis.com"]]
}
