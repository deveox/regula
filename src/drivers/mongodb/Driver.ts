import { Interface } from '@/Interface/index.js'
import { Select } from './Query/Select.js'
import { Create } from './Query/Create.js'
import { Update } from './Query/Update.js'
import { Delete } from './Query/Delete.js'

export class Driver extends Interface.Driver {
  select = Select
  create = Create
  update = Update
  delete = Delete
}
