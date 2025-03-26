
<?php
// Script pour recevoir les webhooks de déploiement GitHub
// Ce fichier doit être placé dans un emplacement accessible par les webhooks GitHub

// Configuration
$logFile = '../logs/deploy-webhook.log';
$secretToken = getenv('GITHUB_WEBHOOK_SECRET'); // À configurer dans les variables d'environnement

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Récupération des données
$payload = file_get_contents('php://input');
$signature = isset($_SERVER['HTTP_X_HUB_SIGNATURE_256']) ? $_SERVER['HTTP_X_HUB_SIGNATURE_256'] : '';

// Journalisation de la requête
$logMessage = date('[Y-m-d H:i:s]') . " Webhook reçu\n";
file_put_contents($logFile, $logMessage, FILE_APPEND);

// Vérification de la signature si un secret est configuré
if (!empty($secretToken)) {
    $computedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secretToken);
    
    if (!hash_equals($computedSignature, $signature)) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid signature']);
        $logMessage = date('[Y-m-d H:i:s]') . " Signature invalide\n";
        file_put_contents($logFile, $logMessage, FILE_APPEND);
        exit;
    }
}

// Décodage du payload
$data = json_decode($payload, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    $logMessage = date('[Y-m-d H:i:s]') . " Payload JSON invalide\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
    exit;
}

// Traitement spécifique selon le type d'événement
$event = isset($_SERVER['HTTP_X_GITHUB_EVENT']) ? $_SERVER['HTTP_X_GITHUB_EVENT'] : 'unknown';

// Journalisation de l'événement
$logMessage = date('[Y-m-d H:i:s]') . " Événement: $event\n";
file_put_contents($logFile, $logMessage, FILE_APPEND);

switch ($event) {
    case 'push':
        // Extraction des informations importantes
        $branch = isset($data['ref']) ? str_replace('refs/heads/', '', $data['ref']) : 'unknown';
        $repository = isset($data['repository']['name']) ? $data['repository']['name'] : 'unknown';
        $commitId = isset($data['after']) ? $data['after'] : 'unknown';
        
        // Journalisation des détails
        $logMessage = date('[Y-m-d H:i:s]') . " Push sur $repository, branche: $branch, commit: $commitId\n";
        file_put_contents($logFile, $logMessage, FILE_APPEND);
        
        // Exécution du script de déploiement (à personnaliser selon vos besoins)
        if ($branch === 'main' || $branch === 'master') {
            // Exécuter le script de déploiement
            $deployScript = './deploy.sh';
            if (file_exists($deployScript)) {
                exec("sh $deployScript > ../logs/deploy.log 2>&1 &");
                $logMessage = date('[Y-m-d H:i:s]') . " Script de déploiement lancé\n";
                file_put_contents($logFile, $logMessage, FILE_APPEND);
            } else {
                $logMessage = date('[Y-m-d H:i:s]') . " Script de déploiement non trouvé\n";
                file_put_contents($logFile, $logMessage, FILE_APPEND);
            }
        }
        break;
        
    case 'ping':
        // Réponse au ping
        $logMessage = date('[Y-m-d H:i:s]') . " Ping reçu\n";
        file_put_contents($logFile, $logMessage, FILE_APPEND);
        break;
        
    default:
        // Événement non géré
        $logMessage = date('[Y-m-d H:i:s]') . " Événement non géré: $event\n";
        file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Réponse
http_response_code(200);
echo json_encode(['status' => 'success', 'event' => $event]);
?>
