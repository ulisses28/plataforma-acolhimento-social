import { apiPost } from './api'

export function registrarDoadorBackend(doador) {
  return apiPost('/doador-auth/registrar', doador)
}

export function loginDoadorBackend(dados) {
  return apiPost('/doador-auth/login', dados)
}

export function solicitarCodigoRecuperacao(email) {
  return apiPost('/doador-auth/solicitar-recuperacao', { email })
}

export function redefinirSenhaDoador(dados) {
  return apiPost('/doador-auth/redefinir-senha', dados)
}