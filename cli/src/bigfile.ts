#!/usr/bin/env ts-node-script

import faker from 'faker'
import fs from 'fs'

faker.locale = 'fr'

const users = [...new Array(1000000).keys()].map((i) => {
    return {
        id: i + 1,
        uuid: faker.random.uuid(),
        age: faker.random.number(120),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        birthday: faker.date.past(),
        eyeColor: faker.commerce.color(),
        addresses: [
            {
                id: faker.random.uuid(),
                city: faker.address.city,
                country: faker.address.country,
                zipCode: faker.address.zipCode(),
                street: faker.address.streetAddress,
                personal: faker.random.boolean(),
            },
            {
                id: faker.random.uuid(),
                city: faker.address.city,
                country: faker.address.country,
                zipCode: faker.address.zipCode(),
                street: faker.address.streetAddress,
            },
        ],
    }
})

fs.writeFileSync('/tmp/bigfile.json', JSON.stringify(users), { encoding: 'utf-8' })

export { users }
