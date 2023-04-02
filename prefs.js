'use strict';

const {Adw, Gio, Gtk} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.wled');

    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // // Create a new preferences row
    // const row = new Adw.ActionRow({ title: 'Show Extension Indicator' });
    // group.add(row);

    // // Create the switch and bind its value to the `show-indicator` key
    // const toggle = new Gtk.Switch({
    //     active: settings.get_boolean ('show-indicator'),
    //     valign: Gtk.Align.CENTER,
    // });
    // settings.bind(
    //     'show-indicator',
    //     toggle,
    //     'active',
    //     Gio.SettingsBindFlags.DEFAULT
    // );

    const urlRow = new Adw.ActionRow({title: 'WLED URL'});
    group.add(urlRow);

    const urlEntry = new Gtk.Entry({
        text: settings.get_string('url'), valign: Gtk.Align.CENTER,
    });
    settings.bind('url', urlEntry, 'text', Gio.SettingsBindFlags.DEFAULT);


    // // Add the switch to the row
    // row.add_suffix(toggle);
    // row.activatable_widget = toggle;

    urlRow.add_suffix(urlEntry);
    urlRow.activatable_widget = urlEntry;

    // Add our page to the window
    window.add(page);
}