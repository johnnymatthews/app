import { WebApplication } from '@/ui_models/application';
import { AppState } from '@/ui_models/app_state';
import { FunctionComponent } from 'preact';
import { PreferencesPane } from '../components';
import { Tools, Defaults, LabsPane } from './general-segments';
import { ExtensionsLatestVersions } from '@/components/Preferences/panes/extensions-segments';
import { Advanced } from '@/components/Preferences/panes/account';
import { observer } from 'mobx-react-lite';

interface GeneralProps {
  appState: AppState;
  application: WebApplication;
  extensionsLatestVersions: ExtensionsLatestVersions;
}

export const General: FunctionComponent<GeneralProps> = observer(
  ({ appState, application, extensionsLatestVersions }) => (
    <PreferencesPane>
      <Tools application={application} />
      <Defaults application={application} />
      <LabsPane application={application} />
      <Advanced
        application={application}
        appState={appState}
        extensionsLatestVersions={extensionsLatestVersions}
      />
    </PreferencesPane>
  )
);