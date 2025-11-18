using UnityEditor;
using UnityEngine;

namespace Editor
{
    public class ComponentCopierTool : EditorWindow
    {
        private GameObject source;
        private GameObject target;
        private GameObject gameObjectToClearComponents;

        bool includeTransform = true;

        private enum CopyMode { ReplaceAll, UpdateOnly }

        private CopyMode copyMode = CopyMode.UpdateOnly;

        [MenuItem("Tools/Component Copier")]
        public static void ShowWindow()
        {
            GetWindow<ComponentCopierTool>("Component Copier");
        }

        private void OnGUI()
        {
            GUILayout.Label("Component Copier Tool", EditorStyles.boldLabel);

            EditorGUILayout.HelpBox("Select the source GameObject to copy components from.", MessageType.Info);
            source = (GameObject)EditorGUILayout.ObjectField(new GUIContent("Source", "GameObject to copy components from"), source, typeof(GameObject), true);

            EditorGUILayout.HelpBox("Select the target GameObject to copy components to.", MessageType.Info);
            target = (GameObject)EditorGUILayout.ObjectField(new GUIContent("Target", "GameObject to copy components to"), target, typeof(GameObject), true);

            GUILayout.Space(10);

            includeTransform = EditorGUILayout.Toggle("Include Transform Values", includeTransform);
            copyMode = (CopyMode)EditorGUILayout.EnumPopup("Copy Mode", copyMode);

            if (GUILayout.Button("Copy Components"))
            {
                CopyComponents();
            }

            GUILayout.Space(20);
            GUILayout.Label("Clear Components Tool", EditorStyles.boldLabel);

            EditorGUILayout.HelpBox("Select the GameObject whose components (except Transform) will be removed.", MessageType.Info);
            gameObjectToClearComponents = (GameObject)EditorGUILayout.ObjectField(new GUIContent("GameObject to Clear", "GameObject to remove all components from (except Transform)"), gameObjectToClearComponents, typeof(GameObject), true);

            if (GUILayout.Button("Clear All Components (Except Transform)"))
            {
                ClearComponents();
            }
        }

        private void CopyComponents()
        {
            if (source == null || target == null)
            {
                Debug.LogWarning("ComponentCopierTool: Source or Target is null.");
                return;
            }

            foreach (var comp in source.GetComponents<Component>())
            {
                // Handle Transform separately
                if (comp is Transform sourceTransform)
                {
                    if (includeTransform)
                    {
                        var targetTransform = target.transform;
                        targetTransform.position = sourceTransform.position;
                        targetTransform.rotation = sourceTransform.rotation;
                        targetTransform.localScale = sourceTransform.localScale;
                    }
                    continue;
                }

                var existing = target.GetComponent(comp.GetType());
                UnityEditorInternal.ComponentUtility.CopyComponent(comp);

                if (copyMode == CopyMode.UpdateOnly)
                {
                    if (existing != null)
                    {
                        UnityEditorInternal.ComponentUtility.PasteComponentValues(existing);
                    }
                    else
                    {
                        UnityEditorInternal.ComponentUtility.PasteComponentAsNew(target);
                    }
                }
                else if (copyMode == CopyMode.ReplaceAll)
                {
                    if (existing != null)
                    {
                        DestroyImmediate(existing);
                    }
                    UnityEditorInternal.ComponentUtility.PasteComponentAsNew(target);
                }
            }

            Debug.Log($"Copied components from '{source.name}' to '{target.name}' using mode: {copyMode}.");
        }

        private void ClearComponents()
        {
            if (gameObjectToClearComponents == null)
            {
                Debug.LogWarning("ComponentCopierTool: GameObject to clear is null.");
                return;
            }

            var components = gameObjectToClearComponents.GetComponents<Component>();
            foreach (var comp in components)
            {
                if (comp is Transform) continue;
                DestroyImmediate(comp);
            }

            Debug.Log($"Cleared all components from '{gameObjectToClearComponents.name}' except Transform.");
        }
    }
}