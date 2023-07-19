"use strict";
import { } from 'editor-build-helper/@types/service/utils'
import { createVue } from './pages'
import { PanelThis, PanelParam } from '../types/service';

export const template: string = ccService.csFile.readFile(__dirname, "./detail.html");
export const style: string = ccService.csFile.readFile(__dirname, "./detail.css");
export const $: any = { app: '#app' }

export function ready (this: PanelThis, info: PanelParam): void {
    // console.log(__dirname, "export function ready(service: any): void")
    this.vm = this.vm || createVue(this, info);
}

export function close (): void { }