import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import PreferencesMenuItem from './PreferencesComponents/MenuItem'
import { PreferencesMenu } from './PreferencesMenu'

type Props = {
  menu: PreferencesMenu
}

const PreferencesMenuView: FunctionComponent<Props> = ({ menu }) => (
  <div className="flex min-w-55 flex-col overflow-y-auto px-3 py-6">
    {menu.menuItems.map((pref) => (
      <PreferencesMenuItem
        key={pref.id}
        iconType={pref.icon}
        label={pref.label}
        selected={pref.selected}
        hasBubble={pref.hasBubble}
        onClick={() => menu.selectPane(pref.id)}
      />
    ))}
  </div>
)

export default observer(PreferencesMenuView)
