use crate::Result;

use std::{env, path::PathBuf};

/// Creates and returns the settings directory pointed to by `MULLVAD_SETTINGS_DIR`, or the default
/// one if that variable is unset.
pub fn settings_dir() -> Result<PathBuf> {
    crate::create_and_return(get_settings_dir, None)
}

fn get_settings_dir() -> Result<PathBuf> {
    match env::var_os("MULLVAD_SETTINGS_DIR") {
        Some(path) => Ok(PathBuf::from(path)),
        None => get_default_settings_dir(),
    }
}

pub fn get_default_settings_dir() -> Result<PathBuf> {
    let dir;
    #[cfg(unix)]
    {
        dir = Ok(PathBuf::from("/etc"));
    }
    #[cfg(windows)]
    {
        dir = dirs::data_local_dir().ok_or_else(|| crate::ErrorKind::FindDirError.into());
    }
    dir.map(|dir| dir.join(crate::PRODUCT_NAME))
}
