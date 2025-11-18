using System;
using UnityEditor;
using UnityEngine;

namespace BackEnd.Project_inspector_Addons
{
#if UNITY_EDITOR
    // Custom drawer for fields marked with [TagSelectorAttribute].
    [CustomPropertyDrawer(typeof(TagSelectorAttribute))]
    public class TagSelectorPropertyDrawer : PropertyDrawer
    {
        public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
        {
            var tagSelector = (TagSelectorAttribute)attribute;
            var dynamicLabel = new GUIContent(label.text, tagSelector.Tooltip);

            if (property.propertyType == SerializedPropertyType.String)
            {
                EditorGUI.BeginProperty(position, dynamicLabel, property);
                position = EditorGUI.PrefixLabel(position, label);

                string[] tags = UnityEditorInternal.InternalEditorUtility.tags;
                int index = Array.IndexOf(tags, property.stringValue);
                index = EditorGUI.Popup(position, index, tags);

                property.stringValue = index >= 0 ? tags[index] : "";
                EditorGUI.EndProperty();
            }
            else
            {
                EditorGUI.PropertyField(position, property, dynamicLabel);
            }
        }
    }
#endif
}