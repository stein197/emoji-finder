// @ts-nocheck
import React from "react";
import type Application from "Application";

let context = React.createContext(null);

export function get(): React.Context<Application> {
	return context;
}

export function set(value: Application): void {
	context = React.createContext(value);
}
