import { TypeAnnotation } from './TypeAnnotation.js';

export const DiscriminatorKey = '__dbDiscriminator';
/**
 * Sets field type to a Discriminator
 *
 * To learn more about discriminators [read this](https://mongoosejs.com/docs/discriminators.html)
 * or [this](https://typegoose.github.io/typegoose/docs/guides/advanced/nested-discriminators)
 * @example
 * enum RoleName {
 *  Admin = 'admin',
 *  User = 'user'
 * }
 * class Role extends Document {
 *   name!: RoleName
 * }
 * class AdminRole extends Role {
 *   name!: RoleName.Admin
 *   adminKey?: string
 * }
 * class UserRole extends Role {
 *  name!: RoleName.User
 *  userData?: string
 * }
 *
 * class User {
 *   role!: Discriminator<AdminRole | UserRole, 'name'>
 * }
 * // mongoose equivalent:
 * // TS support is minimal
 * const Role = new Schema({
 *   name: {
 *     type: String,
 *     enum: ['admin', 'user']
 *   }
 * }, {discriminatorKey: 'name'})
 *
 * const User = new Schema({
 *   role: {type: Role, required: true}
 * })
 *
 * User.path('role').discriminator('user', new Schema({ userData: String }))
 * User.path('role').discriminator('admin', new Schema({ adminKey: String }))
 */
export type Discriminator<T, K extends keyof T> = T & TypeAnnotation<typeof DiscriminatorKey, K>;
