declare var M;

export class MaterialService {
  static toast(message: String) {
    M.toast({html: message});
  }
}
