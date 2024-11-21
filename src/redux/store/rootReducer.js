import { combineReducers } from "@reduxjs/toolkit";
import { reducer as calendarReducer } from "src/redux/slices/calendar";
import { reducer as projectsBoardReducer } from "src/redux/slices/projects_board";
import { reducer as mailboxReducer } from "src/redux/slices/mailbox";
import { reducer as globalReducer } from "src/redux/slices/global";

export const rootReducer = combineReducers({
    global: globalReducer,
    calendar: calendarReducer,
    projectsBoard: projectsBoardReducer,
    mailbox: mailboxReducer,
});
