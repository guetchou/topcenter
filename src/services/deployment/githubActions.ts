
/**
 * Service pour l'intégration avec GitHub Actions
 */

// Configuration de base
const GITHUB_API_BASE = 'https://api.github.com';

// Types pour les workflows GitHub Actions
export interface GithubWorkflow {
  id: number;
  name: string;
  state: string;
  path: string;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_started_at: string;
  run_attempt: number;
  head_sha: string;
  head_branch: string;
}

// Fonction pour récupérer les workflows disponibles
export const getWorkflows = async (owner: string, repo: string): Promise<GithubWorkflow[]> => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      throw new Error("Token GitHub non configuré");
    }

    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/workflows`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API GitHub: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.workflows;
  } catch (error) {
    console.error("Erreur lors de la récupération des workflows:", error);
    throw error;
  }
};

// Fonction pour récupérer les exécutions d'un workflow
export const getWorkflowRuns = async (owner: string, repo: string, workflowId: number): Promise<WorkflowRun[]> => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      throw new Error("Token GitHub non configuré");
    }

    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API GitHub: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.workflow_runs;
  } catch (error) {
    console.error("Erreur lors de la récupération des exécutions de workflow:", error);
    throw error;
  }
};

// Fonction pour déclencher un workflow
export const triggerWorkflow = async (
  owner: string, 
  repo: string, 
  workflowId: string,
  ref: string = 'main',
  inputs: Record<string, string> = {}
): Promise<boolean> => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      throw new Error("Token GitHub non configuré");
    }

    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref,
        inputs
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error("Erreur lors du déclenchement du workflow:", error);
    throw error;
  }
};

// Fonction pour récupérer les logs d'une exécution de workflow
export const getWorkflowRunLogs = async (owner: string, repo: string, runId: number): Promise<string> => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      throw new Error("Token GitHub non configuré");
    }

    // Cette API renvoie un blob avec les logs
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/runs/${runId}/logs`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API GitHub: ${response.status} ${response.statusText}`);
    }
    
    // Les logs sont renvoyés comme un fichier zip
    const blob = await response.blob();
    
    // Ici, on pourrait extraire le contenu du zip, mais pour simplifier
    // nous allons juste indiquer que les logs sont disponibles et suggérer de 
    // les visualiser sur GitHub directement
    return "Logs récupérés avec succès. Utiliser l'API GitHub pour extraire le contenu du zip.";
  } catch (error) {
    console.error("Erreur lors de la récupération des logs:", error);
    throw error;
  }
};
