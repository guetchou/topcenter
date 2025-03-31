
/**
 * Gestionnaire pour les instances ChatPal
 * Permet d'éviter les duplications d'instances et fournit des méthodes pour gérer ChatPal
 */

interface ChatPalConfig {
  embedId: string;
  remoteBaseUrl: string;
  version: string;
  containerSelector?: string;
  position?: 'internal' | 'fixed';
}

class ChatPalManager {
  private static instance: ChatPalManager;
  private activeInstances: Map<string, any> = new Map();

  private constructor() {
    // S'assurer que les instances existantes sont détruites lors du rechargement de la page
    window.addEventListener('beforeunload', () => {
      this.destroyAllInstances();
    });
  }

  public static getInstance(): ChatPalManager {
    if (!ChatPalManager.instance) {
      ChatPalManager.instance = new ChatPalManager();
    }
    return ChatPalManager.instance;
  }

  /**
   * Vérifie si le script ChatPal est chargé et disponible
   */
  public isScriptLoaded(): boolean {
    return typeof window.ChatPal === 'function';
  }

  /**
   * Initialise une instance ChatPal avec la configuration donnée
   * @param config Configuration ChatPal
   * @returns L'instance ChatPal créée ou existante
   */
  public initChatPal(config: ChatPalConfig): any {
    if (!this.isScriptLoaded()) {
      console.error('ChatPal script not loaded or not ready yet');
      return null;
    }

    // Si une instance avec cet embedId existe déjà, la retourner
    if (this.activeInstances.has(config.embedId)) {
      console.log(`Returning existing ChatPal instance for embedId: ${config.embedId}`);
      return this.activeInstances.get(config.embedId);
    }

    try {
      console.log(`Creating new ChatPal instance for embedId: ${config.embedId}`);
      
      // Vérifier si une instance globale existe déjà
      if (window.chatPal && config.embedId === 'HSNNDA8bdXzs') {
        console.log('Using existing global ChatPal instance');
        this.activeInstances.set(config.embedId, window.chatPal);
        return window.chatPal;
      }
      
      // Créer une nouvelle instance
      const instance = new window.ChatPal({
        embedId: config.embedId,
        remoteBaseUrl: config.remoteBaseUrl || 'https://chatappdemo.com/',
        version: config.version || '8.3',
        containerSelector: config.containerSelector,
        position: config.position
      });

      // Stocker l'instance
      this.activeInstances.set(config.embedId, instance);
      
      // Si c'est l'instance principale, la rendre disponible globalement
      if (config.embedId === 'HSNNDA8bdXzs') {
        window.chatPal = instance;
      }
      
      return instance;
    } catch (error) {
      console.error('Failed to initialize ChatPal:', error);
      return null;
    }
  }

  /**
   * Détruit une instance ChatPal spécifique
   * @param embedId ID de l'embed à détruire
   */
  public destroyChatPal(embedId: string): void {
    if (this.activeInstances.has(embedId)) {
      try {
        const instance = this.activeInstances.get(embedId);
        if (instance && typeof instance.destroy === 'function') {
          console.log(`Destroying ChatPal instance: ${embedId}`);
          instance.destroy();
        }
        this.activeInstances.delete(embedId);
        
        // Si c'était l'instance principale globale, nettoyer la référence
        if (embedId === 'HSNNDA8bdXzs' && window.chatPal === instance) {
          window.chatPal = undefined;
        }
      } catch (error) {
        console.error(`Error destroying ChatPal instance ${embedId}:`, error);
      }
    }
  }

  /**
   * Détruit toutes les instances actives
   */
  public destroyAllInstances(): void {
    console.log(`Destroying all ${this.activeInstances.size} ChatPal instances`);
    this.activeInstances.forEach((instance, embedId) => {
      try {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      } catch (error) {
        console.error(`Error destroying ChatPal instance ${embedId}:`, error);
      }
    });
    this.activeInstances.clear();
    
    // Nettoyer la référence globale
    window.chatPal = undefined;
  }

  /**
   * Envoie un message à une instance spécifique
   * @param embedId ID de l'embed
   * @param message Message à envoyer
   */
  public sendMessage(embedId: string, message: string): void {
    if (this.activeInstances.has(embedId)) {
      try {
        const instance = this.activeInstances.get(embedId);
        if (instance && typeof instance.sendMessage === 'function') {
          instance.sendMessage(message);
        }
      } catch (error) {
        console.error(`Error sending message to ChatPal instance ${embedId}:`, error);
      }
    }
  }
}

export default ChatPalManager.getInstance();
