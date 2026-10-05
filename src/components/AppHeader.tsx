import { Box, IconButton, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useI18n } from '../i18n/I18nProvider';
import type { Language } from '../i18n/translations';
import { useThemeMode } from '../theme/ThemeModeProvider';

export function AppHeader() {
  const { t, language, setLanguage } = useI18n();
  const { mode, toggle } = useThemeMode();
  const themeLabel = mode === 'dark' ? t('lightMode') : t('darkMode');

  return (
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
      <AssignmentIcon color="primary" sx={{ fontSize: 36 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          {t('appTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('appSubtitle')}
        </Typography>
      </Box>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={language}
        aria-label={t('language')}
        onChange={(_, v: Language | null) => v && setLanguage(v)}
      >
        <ToggleButton value="tr">TR</ToggleButton>
        <ToggleButton value="en">EN</ToggleButton>
      </ToggleButtonGroup>
      <Tooltip title={themeLabel}>
        <IconButton onClick={toggle} aria-label={themeLabel}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
