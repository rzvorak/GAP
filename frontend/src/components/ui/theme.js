import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        breakpoints: {
            "min": "0px",
            "xxs": "240px",
            "xs": "320px",
        }
    }
})

export const system = createSystem(defaultConfig, config)