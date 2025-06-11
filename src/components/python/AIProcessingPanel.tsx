
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageCircle, BarChart3, Heart, Languages, FileText } from 'lucide-react';
import { pythonAIService, AIModelRequest, AIModelResponse } from '@/services/python/aiService';
import { toast } from 'sonner';

export function AIProcessingPanel() {
  const [model, setModel] = useState<string>('');
  const [input, setInput] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIModelResponse | null>(null);

  const handleProcess = async () => {
    if (!model || !input.trim()) {
      toast.error('Veuillez sélectionner un modèle et saisir du texte');
      return;
    }

    setIsLoading(true);
    
    try {
      const request: AIModelRequest = {
        model: model as any,
        input,
        options: {
          language: targetLanguage,
          maxTokens: 500,
          temperature: 0.7
        }
      };

      const response = await pythonAIService.processWithAI(request);
      setResult(response);
      toast.success('Traitement IA terminé');
      
    } catch (error) {
      console.error('Error processing with AI:', error);
      toast.error('Erreur lors du traitement IA');
    } finally {
      setIsLoading(false);
    }
  };

  const getModelIcon = (modelType: string) => {
    switch (modelType) {
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      case 'classification': return <BarChart3 className="w-4 h-4" />;
      case 'sentiment': return <Heart className="w-4 h-4" />;
      case 'translation': return <Languages className="w-4 h-4" />;
      case 'summarization': return <FileText className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const formatResult = (result: AIModelResponse) => {
    if (typeof result.result === 'string') {
      return result.result;
    }
    
    if (typeof result.result === 'object') {
      return JSON.stringify(result.result, null, 2);
    }
    
    return String(result.result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Traitement IA Python</CardTitle>
          <CardDescription>
            Utilisez les modèles d'IA Python pour traiter du texte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Modèle IA</label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un modèle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chat">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Assistant</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="classification">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>Classification</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sentiment">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Analyse Sentiment</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="translation">
                    <div className="flex items-center space-x-2">
                      <Languages className="w-4 h-4" />
                      <span>Traduction</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="summarization">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Résumé</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {model === 'translation' && (
              <div>
                <label className="text-sm font-medium">Langue cible</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                    <SelectItem value="es">Espagnol</SelectItem>
                    <SelectItem value="de">Allemand</SelectItem>
                    <SelectItem value="it">Italien</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Texte à traiter</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Saisissez le texte à traiter par l'IA..."
              rows={6}
            />
          </div>

          <Button 
            onClick={handleProcess} 
            disabled={isLoading || !model || !input.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                {getModelIcon(model)}
                <span className="ml-2">Traiter avec IA</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Résultat du traitement</span>
              <Badge variant="default">
                Confiance: {Math.round(result.confidence * 100)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Résultat</h4>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{formatResult(result)}</pre>
              </div>
            </div>

            {result.metadata && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Modèle:</span>
                  <br />
                  {result.metadata.model}
                </div>
                <div>
                  <span className="font-medium">Version:</span>
                  <br />
                  {result.metadata.version}
                </div>
                <div>
                  <span className="font-medium">Temps:</span>
                  <br />
                  {Math.round(result.processingTime)}ms
                </div>
                {result.metadata.tokens && (
                  <div>
                    <span className="font-medium">Tokens:</span>
                    <br />
                    {result.metadata.tokens}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
