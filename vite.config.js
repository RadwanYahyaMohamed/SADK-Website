import { defineConfig } from "vite";
import { resolve } from "path";
export default defineConfig({
    root: ".",
    base: "/",
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "pages/login.html"),
                signup: resolve(__dirname, "pages/signup.html"),
                account: resolve(__dirname, "pages/account.html"),
                verifyEmail: resolve(__dirname, "pages/verify-email.html"),
                forgotPassword: resolve(__dirname, "pages/forgot-password.html"),
                resetPassword: resolve(__dirname, "pages/reset-password.html"),
                about: resolve(__dirname, "pages/about.html"),
                contact: resolve(__dirname, "pages/contact.html"),
                resources: resolve(__dirname, "pages/resources.html"),
                materials: resolve(__dirname, "pages/Materials.html"),
                testBanks: resolve(__dirname, "pages/test-banks.html"),
                g10s1: resolve(__dirname, "pages/curriculum/g10/semester1/lektionen.html"),
                g10s2: resolve(__dirname, "pages/curriculum/g10/semester2/lektionen.html"),
                g11s1: resolve(__dirname, "pages/curriculum/g11/semester1/lektionen.html"),
                g11s2: resolve(__dirname, "pages/curriculum/g11/semester2/lektionen.html"),
            },
        },
    },
});
