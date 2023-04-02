'use strict';
/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * The svg icon is from https://commons.wikimedia.org/wiki/File:Simpleicons_Interface_light-bulb-outline.svg and the color was changed to white.
 */

/* exported init */

const St = imports.gi.St;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

class Extension {
    constructor() {
        this._indicator = null;
    }

    enable() {
        log(`enabling ${Me.metadata.name}`);

        this.settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.wled');

        let indicatorName = `${Me.metadata.name} Indicator`;

        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);

        // Add the icon
        let icon = new St.Icon({
            // use the light-bulb.svg file from the extension's directory
            gicon: Gio.icon_new_for_string(`${Me.path}/light-bulb.svg`), style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // execute curl command to toggle light
        this._indicator.connect('button-press-event', () => {
            try {
                const url = this.settings.get_string('url');
                let [out, status] = GLib.spawn_command_line_sync(`curl -X POST "${url}" -d '{"on":"t"}' -H "Content-Type: application/json"`);

                if (status !== 0)
                    throw new Error(`Command failed with status ${status}`);


                const outJson = JSON.parse(out);
                if (outJson.success !== true)
                    throw new Error(`Could not parse JSON: ${out}`);
            } catch (e) {
                log(`Error toggling light: ${e}`);
                Main.notify('WLED', 'Error Toggling Light, \n Check URL');
            }
        });
        Main.panel.addToStatusArea(indicatorName, this._indicator);
    }

    disable() {
        log(`disabling ${Me.metadata.name}`);

        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    return new Extension();
}
