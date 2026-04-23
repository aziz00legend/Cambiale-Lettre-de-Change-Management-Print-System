package com.example.backend.exceptions;

/**
 * Thrown when trying to delete a parent entity that still has child entities.
 */
public class ParentEntityHasChildrenException extends Exception {
    public ParentEntityHasChildrenException(String parentName, String childName) {
        super("Cannot delete " + parentName + " because it still has associated " + childName + ".");
    }

    public ParentEntityHasChildrenException(String message) {
        super(message);
    }
}
