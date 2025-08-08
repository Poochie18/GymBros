const KEY_USERS = 'workout_tracker_users'
const KEY_CURRENT = 'workout_tracker_current_user'

export function getUsers(){
  try{
    return JSON.parse(localStorage.getItem(KEY_USERS) || '[]')
  }catch(e){ return [] }
}
export function saveUsers(users){
  localStorage.setItem(KEY_USERS, JSON.stringify(users))
}
export function getCurrentUser(){
  try{
    return JSON.parse(localStorage.getItem(KEY_CURRENT) || 'null')
  }catch(e){ return null }
}
export function setCurrentUser(user){
  localStorage.setItem(KEY_CURRENT, JSON.stringify(user))
}
export function addUser(user){
  const users = getUsers()
  users.push(user)
  saveUsers(users)
}
export function updateUser(updated){
  const users = getUsers().map(u=> u.username === updated.username ? updated : u)
  saveUsers(users)
  const cu = getCurrentUser()
  if(cu && cu.username === updated.username) setCurrentUser(updated)
}
export function findUser(username){
  return getUsers().find(u=>u.username === username)
}
