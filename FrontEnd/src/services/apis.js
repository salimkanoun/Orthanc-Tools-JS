import importDicom from './importDicom'
import aets from './aets'
import options from './options'
import retrieveRobot from './retrieveRobot'
import query from './query'
import jobs from './jobs'
import retrieve from './retrieve'
import exportDicom from './exportDicom'
import authentication from './authentication'
import peers from './peers'
import content from './content'
import anon from './anon'
import User from './User'
import deleteRobot from './deleteRobot'
import role from './role'
import ldap from './ldap'
import cdBurner from './cdBurner'
import task from './task'
import certificates from './certificates'
import sshKeys from './sshKeys'
import endpoints from './endpoints'
import label from './label'
import studylabel from './studylabel'
import rolelabel from './rolelabel'
import autorouting from './autorouting'
import autorouter from './autorouter'

const apis = {
  importDicom,
  aets,
  options,
  retrieveRobot,
  query,
  jobs,
  retrieve,
  exportDicom,
  authentication, 
  peers, 
  content, 
  anon, 
  User, 
  deleteRobot, 
  role,
  ldap,
  cdBurner,
  task,
  certificates,
  sshKeys,
  endpoints,
  label,
  studylabel,
  rolelabel,
  autorouting,
  autorouter
}

export default apis
