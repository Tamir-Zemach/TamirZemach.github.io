using UnityEngine;

namespace BackEnd.Project_inspector_Addons
{
    public class TagSelectorAttribute : PropertyAttribute
    {
        public string Tooltip { get; }

        public TagSelectorAttribute(string tooltip = "")
        {
            Tooltip = tooltip;
        }
    }
}