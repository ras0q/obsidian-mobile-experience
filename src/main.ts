import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

interface MobileExperiencePluginSettings {
  mySetting: string;
  disableSidebarOnInputFocus: boolean;
}

const DEFAULT_SETTINGS: MobileExperiencePluginSettings = {
  mySetting: "default",
  disableSidebarOnInputFocus: true,
};

export default class MobileExperiencePlugin extends Plugin {
  settings: MobileExperiencePluginSettings = DEFAULT_SETTINGS;

  override async onload() {
    await this.loadSettings();

    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (this.settings.disableSidebarOnInputFocus) {
          const textbox = leaf?.view.containerEl.querySelector(
            ".cm-lineWrapping",
          );
          if (!textbox || !(textbox instanceof HTMLElement)) return;

          textbox.addClass("omx-disable-sidebar-on-input-focus");
          textbox.addEventListener("touchstart", (e) => {
            e.stopPropagation();
          });
        }
      }),
    );

    this.addSettingTab(new MySettingTab(this.app, this));
  }

  override onunload() {
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class MySettingTab extends PluginSettingTab {
  plugin: MobileExperiencePlugin;

  constructor(app: App, plugin: MobileExperiencePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
