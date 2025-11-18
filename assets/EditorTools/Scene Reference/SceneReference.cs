using System;
using UnityEngine;
using UnityEngine.SceneManagement;
#if UNITY_EDITOR
using UnityEditor;
#endif

namespace BackEnd.Project_inspector_Addons
{
    [Serializable]
    public class SceneReference
    {
#if UNITY_EDITOR
        public SceneAsset sceneAsset;
        public void UpdateScenePath()
        {
            if (sceneAsset != null)
            {
                scenePath = AssetDatabase.GetAssetPath(sceneAsset);
            }
            else
            {
                scenePath = string.Empty;
            }
        }
#endif
        
        [SerializeField] private string scenePath; 

        public string GetScenePath() => scenePath;

        public int GetBuildIndex() => SceneUtility.GetBuildIndexByScenePath(scenePath);

        public string GetSceneName()
        {
            return string.IsNullOrEmpty(scenePath) 
                ? string.Empty 
                : System.IO.Path.GetFileNameWithoutExtension(scenePath);
        }

        public override string ToString() => GetSceneName();


    }
}