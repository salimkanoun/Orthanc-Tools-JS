class RoleEntity {
    name;
    import
    content
    anon
    exportLocal
    exportRemote
    query
    autoQuery
    delete
    modify
    cdBurner
    autorouting
    admin
}

RoleEntity.createRolefromDB = (dbEntity) => {
    let role = new RoleEntity()
    role.name = dbEntity.name
    role.import = dbEntity.import
    role.content = dbEntity.content
    role.anon = dbEntity.anon
    role.exportLocal = dbEntity.export_local
    role.exportRemote = dbEntity.export_remote
    role.query = dbEntity.query
    role.autoQuery = dbEntity.auto_query
    role.modify = dbEntity.modify
    role.cdBurner = dbEntity.cd_burner
    role.autorouting = dbEntity.autorouting
    role.admin = dbEntity.admin
    role.delete = dbEntity.delete
    return role
}

module.exports = RoleEntity