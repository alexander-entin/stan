import {telefunc} from "telefunc/vite";
import ssr from "vike/plugin";
import react from "@vitejs/plugin-react";
import {hattip} from "@hattip/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [hattip(), react({}), ssr({}), telefunc()],
});