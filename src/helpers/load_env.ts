import fs from 'fs';

const validEnvs = ['develop', 'staging', 'prod'];

export function load_environment_variable(env: string) {
    if (!validEnvs.includes(env)){
        throw `${env} is not a valid env: ${validEnvs}`
    }
    const rawdata = fs.readFileSync(`env.${env}.json`).toString();
    const envJson = JSON.parse(rawdata)

    for (const [key, value] of Object.entries(envJson)){
        (process.env as any)[key] = value
    }
}

