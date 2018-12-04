use super::{CloseHandle, ErrorKind, Result, ResultExt};
use std::{net::IpAddr, thread, time};


/// Monitors a tunnel device by pinging an IP and closes a tunnel once it fails.
pub struct PingMonitor {
    ip: IpAddr,
    interface: String,
    handle: Box<dyn CloseHandle>,
}

impl PingMonitor {
    pub fn new(ip: IpAddr, interface: String, handle: Box<dyn CloseHandle>) -> Self {
        Self {
            ip,
            interface,
            handle,
        }
    }

    fn cmd(&self, timeout: u64) -> duct::Expression {
        #[cfg(target_os = "linux")]
        {
            duct::cmd!(
                "ping",
                "-n",
                "-c",
                "1",
                "-I",
                &self.interface,
                "-w",
                timeout.to_string(),
                self.ip.to_string()
            )
            .stdin_null()
            .stdout_null()
            .unchecked()
        }
        #[cfg(target_os = "macos")]
        {
            duct::cmd!(
                "ping",
                "-n",
                "-c",
                "1",
                "-b",
                &self.interface,
                "-t",
                timeout.to_string(),
                self.ip.to_string()
            )
            .stdin_null()
            .stdout_null()
            .unchecked()
        }
    }

    pub fn wait(&self, timeout: u64) -> Result<()> {
        let output = self.cmd(timeout).run().chain_err(|| ErrorKind::PingError)?;
        if !output.status.success() {
            bail!(ErrorKind::PingTimeoutError);
        }
        Ok(())
    }

    pub fn monitor_ping(mut self, timeout: u64) {
        thread::spawn(move || loop {
            let deadline = time::Instant::now() + time::Duration::from_secs(timeout);
            if let Err(e) = self.wait(timeout) {
                self.handle.close_with_error(e);
                return;
            }
            let diff = deadline - time::Instant::now();
            thread::sleep(diff);
        });
    }
}
