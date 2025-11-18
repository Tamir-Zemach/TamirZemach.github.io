#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using BackEnd.Project_inspector_Addons;

[CustomPropertyDrawer(typeof(SceneReference))]
public class SceneReferenceDrawer : PropertyDrawer
{
    public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
    {
        EditorGUI.BeginProperty(position, label, property);

        var sceneAssetProp = property.FindPropertyRelative("sceneAsset");
        var scenePathProp = property.FindPropertyRelative("scenePath");

        EditorGUI.BeginChangeCheck();

        SceneAsset newScene = (SceneAsset)EditorGUI.ObjectField(
            position,
            label,
            sceneAssetProp.objectReferenceValue,
            typeof(SceneAsset),
            false
        );

        if (EditorGUI.EndChangeCheck())
        {
            sceneAssetProp.objectReferenceValue = newScene;
            scenePathProp.stringValue = newScene != null
                ? AssetDatabase.GetAssetPath(newScene)
                : string.Empty;

            // 🔐 This commits the change to serialization
            property.serializedObject.ApplyModifiedProperties();
        }

        EditorGUI.EndProperty();
    }
}
#endif