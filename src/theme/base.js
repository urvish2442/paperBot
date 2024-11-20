import { NebulaFighterTheme } from "./schemes/NebulaFighterTheme";
import { DarkSpacesTheme } from "./schemes/DarkSpacesTheme";
import { GreenFieldsTheme } from "./schemes/GreenFieldsTheme";
import { PureLightTheme } from "./schemes/PureLightTheme";
import { GreyGooseTheme } from "./schemes/GreyGooseTheme";
import { PurpleFlowTheme } from "./schemes/PurpleFlowTheme";

const themeMap = {
    NebulaFighterTheme,
    DarkSpacesTheme,
    GreenFieldsTheme,
    PureLightTheme,
    GreyGooseTheme,
    PurpleFlowTheme,
};

export function themeCreator(theme) {
    return themeMap[theme];
}
