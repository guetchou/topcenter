
/**
 * Service pour interagir avec les GitHub Actions pour déclencher des déploiements
 */

export const triggerWorkflow = async (
  owner: string,
  repo: string,
  workflow: string,
  branch: string
): Promise<boolean> => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      console.error("GitHub token non défini. Veuillez configurer VITE_GITHUB_TOKEN dans vos variables d'environnement.");
      throw new Error("VITE_GITHUB_TOKEN n'est pas défini");
    }
    
    // Construire l'URL de l'API GitHub pour déclencher le workflow
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: branch
      })
    });
    
    if (response.status === 204) {
      console.log(`Workflow ${workflow} déclenché avec succès`);
      return true;
    } else {
      console.error(`Erreur lors du déclenchement du workflow: ${response.status}`);
      const errorData = await response.json().catch(() => ({}));
      console.error("Détails de l'erreur:", errorData);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors du déclenchement du workflow GitHub:", error);
    throw error;
  }
};

export const getWorkflowRuns = async (
  owner: string,
  repo: string,
  workflow: string,
  perPage = 5
): Promise<any[]> => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      console.error("GitHub token non défini");
      return [];
    }
    
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/runs?per_page=${perPage}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.workflow_runs || [];
    } else {
      console.error(`Erreur lors de la récupération des exécutions de workflow: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des exécutions de workflow:", error);
    return [];
  }
};

// Fonction pour vérifier le statut des exécutions de workflow en cours
export const checkWorkflowStatus = async (
  owner: string,
  repo: string,
  runId: number
): Promise<string> => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      console.error("GitHub token non défini");
      return 'unknown';
    }
    
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.status || 'unknown';
    } else {
      console.error(`Erreur lors de la récupération du statut de l'exécution: ${response.status}`);
      return 'error';
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du statut du workflow:", error);
    return 'error';
  }
};
